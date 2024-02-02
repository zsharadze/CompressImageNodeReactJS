import { useCallback, useMemo, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RangeSlider from "./rangeSlider";
import LoaderModal from "./loaderModal";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [compressPercent, setCompressPercent] = useState(50);
  const [imagePreviewOriginal, setImagePreviewOriginal] = useState<string | null>(null);
  const [imageAsFileOriginal, setImageAsFileOriginal] = useState<string | Blob>("");
  const [compressedImage, setCompressedImage] = useState("");
  const [originalImageSizeTxt, setOriginalImageSizeTxt] = useState("");
  const [compressedImageSizeTxt, setCompressedImageSizeTxt] = useState("");

  const sliderValueChanged = useCallback((val) => {
    setCompressPercent(val);
  }, []);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const onSelectImageClick = () => {
    inputFile?.current?.click();
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      setImagePreviewOriginal(URL.createObjectURL(file));
      setImageAsFileOriginal(file);
      setOriginalImageSizeTxt(getFileSize(file.size));
    }
  };

  const sliderProps = useMemo(
    () => ({
      min: 1,
      max: 100,
      value: compressPercent,
      step: 1,
      onChange: (e) => sliderValueChanged(e),
    }),
    [compressPercent]
  );

  const compressImageClicK = async () => {
    if (!imageAsFileOriginal) {
      return;
    }

    const formData = new FormData();
    formData.append("file", imageAsFileOriginal);
    formData.append("compressPercent", compressPercent.toString());

    try {
      setIsLoading(true);
      const result = await fetch(
        process.env.REACT_APP_API_URL + "compressimage",
        {
          method: "POST",
          body: formData,
        }
      );

      if (result?.body) {
        result.blob().then((body) => {
          setCompressedImage("");
          setCompressedImage(URL.createObjectURL(body));
          setCompressedImageSizeTxt(getFileSize(body.size));
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCompressedImage = () => {
    if (!compressedImage) return;
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = "compressedImage.jpg";
    link.click();
  };

  const getFileSize = (fileLength) => {
    let sizes = ["B", "KB", "MB", "GB", "TB"];

    let order = 0;
    while (fileLength >= 1024 && order < sizes.length - 1) {
      order++;
      fileLength = fileLength / 1024;
    }

    let formattedFileSize = (Math.round(fileLength * 100) / 100).toFixed(2);
    return formattedFileSize + " " + sizes[order];
  };

  return (
    <>
      <div className="App">
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            marginRight: "417px",
          }}
        >
          <button className="btn btn-primary" onClick={onSelectImageClick}>
            Select image to compress
          </button>
          <input
            ref={inputFile}
            style={{ visibility: "hidden" }}
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={onImageChange}
          />
        </div>

        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            width: "427px",
            height: "341px",
            marginRight: "30px",
          }}
        >
          <span>Original</span>
          <span style={{ float: "right" }}>{originalImageSizeTxt}</span>
          <div
            style={{
              display: "inline-block",
              verticalAlign: "top",
              width: "427px",
              height: "341px",
              border: "1px solid black",
              marginRight: "30px",
            }}
          >
            {imagePreviewOriginal && (
              <img
                src={imagePreviewOriginal}
                alt="img"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
          <span>Compress Percent (Low = Lower Quality)</span>
          <div>
            <RangeSlider {...sliderProps} classes="" />
          </div>
        </div>
        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            width: "427px",
            height: "341px",
            marginRight: "30px",
          }}
        >
          <span>Compressed</span>
          <span style={{ float: "right" }}>{compressedImageSizeTxt}</span>
          <div
            style={{
              display: "inline-block",
              verticalAlign: "top",
              width: "427px",
              height: "341px",
              border: "1px solid black",
            }}
          >
            {compressedImage && (
              <img
                src={compressedImage}
                alt="img"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
          <div style={{ marginTop: "10px" }}>
            <button
              className="btn btn-dark float-left"
              onClick={compressImageClicK}
            >
              Compress
            </button>
            <button
              className="btn btn-success float-right"
              onClick={downloadCompressedImage}
            >
              Download
            </button>
          </div>
        </div>
      </div>
      <LoaderModal showLoader={isLoading} />
    </>
  );
}

export default App;
