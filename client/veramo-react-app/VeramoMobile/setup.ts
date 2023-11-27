// filename: setup.ts

// imports:
// Core interfaces
import { createAgent, IDataStore, IDataStoreORM, IDIDManager, IKeyManager, IResolver } from '@veramo/core'

// Core identity manager plugin. This allows you to create and manage DIDs by orchestrating different DID provider packages.
// This implements `IDIDManager`
import { DIDManager } from '@veramo/did-manager'

// Core key manager plugin. DIDs use keys and this key manager is required to know how to work with them.
// This implements `IKeyManager`
import { KeyManager } from '@veramo/key-manager'

// This plugin allows us to create and manage `did:ethr` DIDs. (used by DIDManager)
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// A key management system that uses a local database to store keys (used by KeyManager)
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// Storage plugin using TypeORM to link to a database
import { Entities, KeyStore, DIDStore, migrations, PrivateKeyStore } from '@veramo/data-store'

// TypeORM is installed with '@veramo/data-store'
import { DataSource } from 'typeorm'

const INFURA_PROJECT_ID = '9e2116bae8aa4b21ad3ffc4a93c4598f'

const DB_ENCRYPTION_KEY = '10f61d7f4856654a03b480e608da97393f621f528ce381bcb24c1b5cbf12e806'

// filename: setup.ts

// ... imports & CONSTANTS

// DB setup:
let dbConnection = new DataSource({
    type: 'expo',
    driver: require('expo-sqlite'),
    database: 'veramo.sqlite',
    migrations: migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
  }).initialize()

  // filename: src/veramo/setup.ts

// ... imports & CONSTANTS & DB setup

// Veramo agent setup
export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM>({
    plugins: [
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY))),
        },
      }),
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: 'did:ethr:goerli',
        providers: {
          'did:ethr:goerli': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'goerli',
            name: 'goerli',
            rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
            gas: 1000001,
            ttl: 31104001,
          }),
        },
      }),
    ],
  })