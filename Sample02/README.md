# ObjectStorageforSCPusingAWSSDKJS
Guide Object Storage for SCP using AWS SDK Javascript based on TypeScript

### 환경설정

#### npm init
```sh
npm init -y
```

#### aws-sdk 설치
```sh
npm install aws-sdk
```

#### typescript 설치
```sh
npm install --save-dev typescript @types/node
```

#### tsconfig.json 파일 생성 후 TypeScript 설정 추가
```sh
{
    "compilerOptions": {
      "target": "ES2018",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "outDir": "./dist"
    },
    "include": ["src/**/*.ts"],
    "exclude": ["node_modules"]
  }
```

#### package.json 파일에 Build Script 추가
```sh
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node dist/app.js",
    "build": "tsc"
  },
```

#### endpoint 주소
 - https://obj1.kr-east-1.samsungsdscloud.com:8443

### Build 및 실행
#### Build
```sh
npm run build
```
 - 프로젝트의 루트 디렉토리에서 명령어 실행
 - dist 디렉터리에 빌드 파일 생성

#### 실행
```sh
node dist/app.js
```

### 참고자료
 - https://youtu.be/RPGpA5OLt7M?si=XOQEFNxKPUu22T5R