import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';

// 1. Create Persistent Docker Volume for SQLite Database & Backup Files
const dataVolume = new docker.Volume('cari-finance-data-volume', {
  name: 'cari_finance_data',
});

// 2. Build and Deploy Web Container
const webImage = new docker.Image('cari-finance-web-image', {
  build: {
    context: '../',
    dockerfile: '../Dockerfile',
  },
  imageName: 'cari-finance-web:latest',
});

const webContainer = new docker.Container('cari-finance-web-container', {
  name: 'cari_finance_web',
  image: webImage.baseImageName,
  restart: 'always',
  ports: [
    {
      internal: 3000,
      external: 3000,
    },
  ],
  envs: [
    'NODE_ENV=production',
    'PORT=3000',
  ],
  volumes: [
    {
      volumeName: dataVolume.name,
      containerPath: '/app/data',
    },
  ],
});

export className = webContainer.name;
export const webPort = 3000;
