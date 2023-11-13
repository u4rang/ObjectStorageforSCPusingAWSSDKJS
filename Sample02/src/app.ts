import * as SCP from 'aws-sdk';
import * as fs from 'fs';

// AWS 자격 증명 설정 (환경변수나 다른 방법으로 설정할 수도 있습니다)
const credentials = new SCP.Credentials({
  accessKeyId: '10bbebf9b92a30875dec',
  secretAccessKey: '2e3f78473694ade251ef9945',
});

// AWS S3 클라이언트 생성
const s3 = new SCP.S3({
  credentials,
  endpoint: 'https://obj1.kr-east-1.samsungsdscloud.com:8443',
  s3ForcePathStyle: true
});

// 업로드할 파일 경로 및 S3 버킷 및 키 설정
// const filePath = '../Files/my-txt-file.txt';
const filePath = '../Files/158_WS_230521.zip';
const bucketName = 'objhwan';
// const key = 'my-txt-file.txt';
const key = '158_WS_230521.zip';

// 파일을 읽어서 S3에 업로드하는 함수
function uploadFileToS3(filePath: string, bucketName: string, key: string) {
  const fileContent = fs.readFileSync(filePath);

  const params: SCP.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file to S3:', err);
    } else {
      console.log('File uploaded successfully. S3 Location:', data.Location);
    }
  });
}

// 파일 업로드 실행
// uploadFileToS3(filePath, bucketName, key);

// 파일을 읽어서 S3에 MultipartUpload 함수
function uploadLargeFileToS3(filePath: string, bucketName: string, key: string, retryCount: number = 3) {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('Error: File not found.');
    return;
  }

  const fileStream = fs.createReadStream(filePath);

  const params: AWS.S3.CreateMultipartUploadRequest = {
    Bucket: bucketName,
    Key: key,
  };

  s3.createMultipartUpload(params, (err, data) => {
    if (err) {
      console.error('Error creating multipart upload:', err);
      return;
    }

    const uploadId = data.UploadId;
    const parts: AWS.S3.CompletedPart[] = [];
    let partNumber = 1;

    fileStream.on('data', (chunk) => {
      if (chunk) {
        uploadPart(partNumber, chunk as Buffer);
      }
    });

    fileStream.on('end', () => {
      completeMultipartUpload();
    });

    function uploadPart(partNumber: number, chunk: Buffer, attempt: number = 1) {
      if (uploadId) {
        const partParams: AWS.S3.UploadPartRequest = {
          Body: chunk,
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        };

        s3.uploadPart(partParams, (uploadErr, uploadData) => {
          if (uploadErr) {
            console.error(`Error uploading part ${partNumber}:`, uploadErr);
            if (attempt < retryCount) {
              console.log(`Retrying upload part ${partNumber}... (Attempt ${attempt + 1}/${retryCount})`);
              uploadPart(partNumber, chunk, attempt + 1);
            } else {
              console.error(`Exceeded retry attempts for upload part ${partNumber}.`);
            }
            return;
          }

          console.log('Part', partNumber, 'uploaded:', uploadData.ETag);
          parts.push({ ETag: uploadData.ETag, PartNumber: partNumber });
          partNumber++;
        });
      }
    }

    function completeMultipartUpload() {
      if (uploadId) {
        const completeParams: AWS.S3.CompleteMultipartUploadRequest = {
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts },
        };

        s3.completeMultipartUpload(completeParams, (completeErr, completeData) => {
          if (completeErr) {
            console.error('Error completing multipart upload:', completeErr);
          } else {
            console.log('Multipart upload completed. S3 Location:', completeData.Location);
          }
        });
      }
    }

/*    
    fileStream.on('data', (chunk) => {
      // Check if UploadId is defined before using it
      if (uploadId) {
        const partParams: AWS.S3.UploadPartRequest = {
          Body: chunk,
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId, // TypeScript may still complain here, but it's expected
          PartNumber: partNumber,
        };

        s3.uploadPart(partParams, (uploadErr, uploadData) => {
          if (uploadErr) {
            console.error('Error uploading part:', uploadErr);
            return;
          }

          console.log('Part', partNumber, 'uploaded:', uploadData.ETag);
          parts.push({ ETag: uploadData.ETag, PartNumber: partNumber });
          partNumber++;
        });
      }
    });

    fileStream.on('end', () => {
      // Check if UploadId is defined before using it
      if (uploadId) {
        const completeParams: AWS.S3.CompleteMultipartUploadRequest = {
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts },
        };

        s3.completeMultipartUpload(completeParams, (completeErr, completeData) => {
          if (completeErr) {
            console.error('Error completing multipart upload:', completeErr);
          } else {
            console.log('Multipart upload completed. S3 Location:', completeData.Location);
          }
        });
      }
    });
*/
  });
}

// MultipartUpload 실행
uploadLargeFileToS3(filePath, bucketName, key, 3);