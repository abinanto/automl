const express = require("express");
const fileUpload = require("express-fileupload");
const automl = require("@google-cloud/automl");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: "key.json",
});
const autoMlClient = new automl.PredictionServiceClient({
  keyFilename: "key.json",
});

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const projectId = `PROJECT-ID`;
const computeRegion = `us-central1`;
const modelId = `MODEL-ID`;

let identifyImage = async (filePath) => {
  try {
    console.log('IDENTIFYING IMAGE')
    const modelFullId = autoMlClient.modelPath(
      projectId,
      computeRegion,
      modelId
    );
    const content = fs.readFileSync(filePath, "base64");
    const params = {};
    const scoreThreshold = `0.9`;

    if (scoreThreshold) {
      params.score_threshold = scoreThreshold;
    }

    const payload = {};
    payload.image = { imageBytes: content };

    const [response] = await autoMlClient.predict({
      name: modelFullId,
      payload: payload,
      params: params,
    });
    console.log("Prediction results : ", JSON.stringify(response));
    let isLeft = false;
    response.payload.forEach((result) => {
      console.log(`Predicted class name: ${result.displayName}`);
      console.log(`Predicted class score: ${result.classification.score}`);
      isLeft = result.displayName === "left";
    });
    return { isLeft };
  } catch (e) {
    console.log('AUTO ML DOWN')
    const response = { isLeft: Math.random() < 0.5 };
    return response;
  }
};

app.post("/uploadfile", (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files.myFile).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.myFile;
  uploadPath = __dirname + "/images/" + sampleFile.name;

  sampleFile.mv(uploadPath, async (err) => {
    if (err) return res.status(500).send(err);
    //let labels = await getImageLabels(sampleFile.name);
    let labels = await identifyImage(uploadPath);
    res.send({ labels });
  });
});

let getImageLabels = async (name) => {
  let labels = await visionClient
    .labelDetection(`./images/${name}`)
    .then(
      (results) => {
        let labels = results[0].labelAnnotations;
        console.log(JSON.stringify(results));
        return labels;
      },
      (err) => {
        console.error("ERROR:", err);
        return [];
      }
    )
    .catch((err) => {
      console.error("ERROR:", err);
      return [];
    });

  return labels;
};

app.listen(3000, () => {
  console.log("server started on port 3000");
});
