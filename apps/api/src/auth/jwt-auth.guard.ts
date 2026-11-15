import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      utilisateurId?: string;
    }>();
    const header = request.headers.authorization ?? "";
    const jeton = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

    if (!jeton) {
      throw new UnauthorizedException("Connexion requise.");
    }

    try {
      const payload = this.jwt.verify<{ sub: string }>(jeton);
      request.utilisateurId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException("Connexion requise.");
    }
  }
}
