import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
  ConfigService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: ConfigService.get('JWT_SECRET_KEY'),
    signOptions: { expiresIn: '0s' },
  };
};

export const getTokenExpireTime = async (ConfigService: ConfigService) => {
  const timeHour = (await ConfigService.get('TOKEN_EXPIRE_TIME')) || '1h';
  const hours = timeHour.match(/\d+/gi)[0];
  return +hours * 60 * 60;
};
