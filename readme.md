# image-lambda

[![Build Status](https://travis-ci.org/slimfancy/image-lambda.svg?branch=master)](https://travis-ci.org/slimfancy/image-lambda)

An AWS Lambda function that AWS S3 can invoke to create thumbnails or reduce file size for png and jpg images.

Features:
- Reduce jpg/png file size.  Image file size is reduced by more than 70%.
- PNG files with 100% support for transparency.
- Resize jpg/png based on configuration.

## Dependencies
- `node`, version: 4.x
- `Vagrant`, Required to build the deployment zip package. If you are already working on Linux system, you don't have to install Vagrant.

## How it works

Once you deployed **image-lambda** package to AWS Lambda and configured it. When an image is uploaded to AWS S3 bucket, S3 sends an notification to AWS Lambda and invokes the **image-lambda** function. **image-lambda** reduce/resize the image based on configuration and then put the processed images to target bucket/directory.

![AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/images/push-s3-example-10.png)

**image-lambda** use [GraphicsMagick](https://github.com/aheckmann/gm) to resize image, and [imagemin](https://github.com/imagemin/imagemin) to reduce image file size.

## Installation

```
git clone https://github.com/SlimFancy/image-lambda.git
cd image-lambda
node docker-npm.js install
serverless deploy
```

## Configuration
**image-lambda** supports configuration for reduce/resize image. There is `config.json.sample` in project root directory as example. You can copy to use it.

```
$ cp config.json.example config.json
```

Here is an example of configuration:

```
{
  "reduce": {
    "sourceDir": "images/uploads",
    "targetBucket": "example",
    "targetDir": "images/reduce",
    "ACL": "public-read"
  },
  "resizes": [
    {
      "width": 100,
      "sourceDir": "images/uploads",
      "targetBucket": "example",
      "targetDir": "images/100w",
      "ACL": "public-read"
    },
    {
      "height": 200,
      "sourceDir": "images/uploads",
      "targetBucket": "example",
      "targetDir": "images/200h",
      "ACL": "public-read"
    },
    {
      "height": 200,
      "width": 200,
      "resizeOption": "^",
      "sourceDir": "images/uploads",
      "targetBucket": "example",
      "targetDir": "images/200",
      "format": "jpg",
      "ACL": "public-read"
    }
  ]
}
```
- `reduce`: Define params for reduce image.
- `resizes`: Define different image sizes. This example creates 3 thumbnails with different sizes.
- `sourceDir/targetDir`: For example, the uploaded image S3 key is "images/uploads/test-images/test.jpg", you want to generate a reduced image to directory *images/reduce*,  so you can configure `sourceDir=images/uploads` and `targetDir=images/reduce`. Thus, you will get a reduced image with key "images/reduce/test-images/test.jpg". **image-lambda** replace the `sourceDir` in image s3 key with the `targetDir`.
- `ACL`: *private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control*. Controls the permission of generated images.
- `targetBucket`: (Optionally) Specify the bucket where you want to put the generated images. If omitted will use the same bucket as the source image.
- `width/height`: It's better to just specify one of them, the other side can be resized based on the ratio.
- `resizeOption`: For resizing images, this optional parameter can be set to one of the [ImageMagick geometry operators](https://www.imagemagick.org/script/command-line-processing.php#geometry).
- `format`: specify a different output format for the image (this parameter only valid for for resizes).

## Deploy using serverless

This now uses the [serverless](https://github.com/serverless/serverless) framework to deploy the code.

```
serverless deploy
```

A few caveats:
* At the moment I haven't parameterised this, so the source directory needs to match between [serverless.yml](serverless.yml) and [config.json](config.json), also the bucket name is manually specified at several locations in [serverless.yml](serverless.yml).
* The bucket can't already exist prior to the first deploy even in your own account. On my todo list is to review [https://github.com/matt-filion/serverless-external-s3-event](https://github.com/matt-filion/serverless-external-s3-event) as a workaround for that.

## Contributing

If you'd like to contribute to the project, feel free to submit a PR.

Run tests:

```
$ npm test
```

`test/fixture` directory contains jpg and png images for testing. After you run tests, the reduced and resized images are stored in `test/out`.

## License

MIT
