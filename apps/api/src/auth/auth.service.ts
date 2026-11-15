import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  type AuthReponse,
  type ConnexionInput,
  type InscriptionInput,
  type MatiereCode,
  type NiveauCode,
  type RoleUtilisateur,
  type ScoreHistorique,
  type TypeSession,
  type Utilisateur,
} from "@education-togo/shared";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

const COUT_HASH = 12;

type UtilisateurAvecProfil = {
  id: string;
  nom: string;
  email: string;
  motDePasseHash: string;
  role: RoleUtilisateur;
  classe: { code: string } | null;
  matieres: { matiere: { code: string } }[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async inscrire(input: InscriptionInput): Promise<AuthReponse> {
    const niveau = await this.prisma.niveau.findUnique({ where: { code: input.classe } });
    const matieres = await this.prisma.matiere.findMany({
      where: { code: { in: [...input.matieres] } },
    });

    if (!niveau || matieres.length !== input.matieres.length) {
      throw new UnauthorizedException("La classe ou les matières ne sont pas reconnues.");
    }

    const motDePasseHash = await bcrypt.hash(input.motDePasse, COUT_HASH);

    try {
      const utilisateur = await this.prisma.utilisateur.create({
        data: {
          nom: input.nom,
          email: input.email,
          motDePasseHash,
          niveauId: niveau.id,
          matieres: {
            create: matieres.map((matiere) => ({ matiereId: matiere.id })),
          },
        },
        include: this.inclusionProfil(),
      });

      return this.reponse(utilisateur);
    } catch (error) {
      if (this.estDoublon(error)) {
        throw new ConflictException("Un compte existe déjà avec cet email.");
      }
      throw error;
    }
  }

  async connecter(input: ConnexionInput): Promise<AuthReponse> {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: input.email },
      include: this.inclusionProfil(),
    });

    const motDePasseValide = utilisateur
      ? await bcrypt.compare(input.motDePasse, utilisateur.motDePasseHash)
      : false;

    if (!utilisateur || !motDePasseValide) {
      throw new UnauthorizedException("Email ou mot de passe incorrect.");
    }

    return this.reponse(utilisateur);
  }

  async profil(utilisateurId: string): Promise<Utilisateur> {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: this.inclusionProfil(),
    });

    if (!utilisateur) {
      throw new UnauthorizedException("Connexion requise.");
    }

    return this.versProfil(utilisateur);
  }

  async historique(utilisateurId: string): Promise<ScoreHistorique[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId: utilisateurId, fin: { not: null } },
      orderBy: { fin: "desc" },
      take: 40,
      include: { chapitre: { include: { niveau: true, matiere: true } } },
    });

    return sessions.flatMap((session) => {
      if (!session.fin) {
        return [];
      }
      return [
        {
          id: session.id,
          type: session.type as TypeSession,
          score: session.score,
          total: session.total,
          fin: session.fin.toISOString(),
          chapitre: {
            id: session.chapitre.id,
            titre: session.chapitre.titre,
            niveau: {
              code: session.chapitre.niveau.code as NiveauCode,
              libelle: session.chapitre.niveau.libelle,
            },
            matiere: {
              code: session.chapitre.matiere.code as MatiereCode,
              nom: session.chapitre.matiere.nom,
            },
          },
        },
      ];
    });
  }

  private reponse(utilisateur: UtilisateurAvecProfil): AuthReponse {
    return {
      jeton: this.jwt.sign({ sub: utilisateur.id, email: utilisateur.email }),
      utilisateur: this.versProfil(utilisateur),
    };
  }

  private versProfil(utilisateur: UtilisateurAvecProfil): Utilisateur {
    return {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      classe: utilisateur.classe ? (utilisateur.classe.code as NiveauCode) : null,
      matieres: utilisateur.matieres.map((lien) => lien.matiere.code as MatiereCode),
    };
  }

  private inclusionProfil() {
    return {
      classe: true,
      matieres: { include: { matiere: true } },
    } as const;
  }

  private estDoublon(error: unknown) {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    );
  }
}
