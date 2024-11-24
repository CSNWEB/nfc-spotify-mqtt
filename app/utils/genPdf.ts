import { PDFDocument, StandardFonts, rgb, grayscale } from "pdf-lib";

const mmToPdfPosition = (mm: number) => mm * 2.8346;

const reversedPositions: { x: number; y: number }[] = [];
const rows = 5;
const columns = 2;
const rowHeight = mmToPdfPosition(50.8);
const columnWidth = mmToPdfPosition(83.82 + 5.08);

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const x = mmToPdfPosition(18.64) + (1 - col) * columnWidth;
    const y = mmToPdfPosition(21.5) + row * rowHeight;
    reversedPositions.push({ x, y });
  }
}

const positions = reversedPositions.reverse();

export const genPdf = async (
  titles: { spotify_image: string; name: string }[],
  offset: number,
) => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  const slicedTitles = titles.slice(0, positions.length - offset);
  const relevantPositions = positions.slice(
    offset,
    slicedTitles.length + offset,
  );

  // Fetch JPEG image
  const titlesWithImages = await Promise.all(
    slicedTitles.map(async (title) => {
      const jpgImageBytes = await fetch(title.spotify_image).then((res) =>
        res.arrayBuffer(),
      );
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      return {
        name: title.name,
        image: jpgImage,
      };
    }),
  );

  // Add a blank page to the document
  const page = pdfDoc.addPage();

  const HelveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Draw the JPG image in the center of the page

  //   page.drawRectangle({
  //     x: mmToPdfPosition(18.64),
  //     y: mmToPdfPosition(21.5),
  //     width: mmToPdfPosition(83.82),
  //     height: mmToPdfPosition(50.8),
  //     borderWidth: 1,
  //     borderColor: grayscale(0.5),
  //   });

  //   page.drawRectangle({
  //     x: mmToPdfPosition(18.64 + 83.82 + 5.08),
  //     y: mmToPdfPosition(21.5),
  //     width: mmToPdfPosition(83.82),
  //     height: mmToPdfPosition(50.8),
  //     borderWidth: 1,
  //     borderColor: grayscale(0.5),
  //   });

  const imgHeight = mmToPdfPosition(35);
  const imgWidth = mmToPdfPosition(35);

  relevantPositions.forEach(({ x, y }, index) => {
    // page.drawRectangle({
    //   x,
    //   y,
    //   width: mmToPdfPosition(83.82),
    //   height: mmToPdfPosition(50.8),
    //   borderWidth: 1,
    //   borderColor: grayscale(0.5),
    // });

    page.drawImage(titlesWithImages[index].image, {
      x: x + mmToPdfPosition(5),
      y: y + (rowHeight - imgHeight) / 2,
      width: imgWidth,
      height: imgHeight,
    });

    const fontHeight = HelveticaFont.heightAtSize(12);

    page.drawText(titlesWithImages[index].name, {
      x: x + mmToPdfPosition(8) + imgWidth,
      y: y + rowHeight - (rowHeight - imgHeight) / 2 - fontHeight,
      size: 12,
      maxWidth: mmToPdfPosition(83.82) - mmToPdfPosition(8) - imgWidth,
      lineHeight: 14,
      font: HelveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = window.URL.createObjectURL(blob);
  window.open(link);
};
