import { getPdf } from "@/api/print";

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
export const printPdf = async (file: string) => {
    const print = (await import("print-js")).default;
    const res = await getPdf(file);

    const base64 = await blobToBase64(res.data);

    const base64Clean = base64.split(',')[1];

    console.log("base64", base64);
    print({
        printable: base64Clean,
        type: "pdf",
        base64: true,
    });

}