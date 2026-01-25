import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// UUID Provider
const UuidProvider = {
  provide: 'UUID',
  useFactory: () => uuidv4,
};

@Module({
  providers: [UuidProvider],
  exports: [UuidProvider],
})
export class CommonModule {}
