import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EthernalMailProvider from './MailProvider/implementations/EthernalMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
    'MailProvider',
    mailConfig.driver === 'ethereal'
        ? container.resolve(EthernalMailProvider)
        : container.resolve(SESMailProvider),
);
