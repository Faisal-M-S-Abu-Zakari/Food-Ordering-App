import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { url } from "node:inspector/promises";

type FormDataFile = Blob & {
  name?: string; // optional : some browsers may add this
};
export async function POST(request: Request) {
  // i use try and catch , beacuse here i try to upload photo to cloudinary
  try {
    // it can be solved in other way like json ==> request.json()
    const formData = await request.formData();
    // here i will get the file that user choose in EditUserForm file with name="file"
    const file = formData.get("file") as FormDataFile | null;
    // pathName is the folder name in cloudinary that will save the photo in it (to arrange your photos in specific folder)
    // if the photo is profile then pathName will represent profile folder , if the photo is product then the path name will represent products folder
    const pathName = formData.get("pathName") as string;
    // if user didn't send any photo
    if (!file) {
      return NextResponse.json({ error: "No File Provided" }, { status: 400 });
    }
    // if user send file , the n upload it to cloudinary
    // so , convert the file to a format cloudinary can handle (Buffer or Base64)
    const fileBuffer = await file.arrayBuffer();
    // then convert the buffer to base64
    const base64File = Buffer.from(fileBuffer).toString("base64");
    // upload to cloudinary
    // determine the file type (svg ,  png , jpeg ...) and the base64
    const uploadResponse = await cloudinary.uploader.upload(
      `data : ${file.type}; base64,${base64File}`,
      {
        //   here i determine the folder that will contain the photo
        folder: pathName,
        // to determine the image properties
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
        ],
      }
    );
    // then return the url from cloudinary as json
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.log("Error uploading file to cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
