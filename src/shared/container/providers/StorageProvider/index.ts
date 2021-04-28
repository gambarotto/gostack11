import { container } from 'tsyringe';
import DiskStorageProvider from './implementations/DiskStorageProvider';

import IStorageProvider from './models/IStorageProvider';

const providers = {
  diskStorage: DiskStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers.diskStorage,
);
