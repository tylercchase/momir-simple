const {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
    BreakLine,
} = require("node-thermal-printer");
import type { SlimCard } from "@/shared/cards/slim-card.model";
import { getDeviceList } from "usb";
import sharp from "sharp";

const PRINTER_PRODUCT_ID = 33054;

const printToUSBPrinter = async (data) => {
    const printer = getDeviceList().find((x) => {
        return x.deviceDescriptor.idProduct === PRINTER_PRODUCT_ID;
    });
    if (!printer) {
        throw new Error("Printer not found");
    }

    try {
        printer.open();

        const iface = printer.interfaces[0];
        if (iface.isKernelDriverActive()) {
            iface.detachKernelDriver();
        }

        iface.claim();

        const outEndpoint = iface.endpoints.find((ep) => {
            return ep.direction === "out";
        });

        if (!outEndpoint) {
            throw new Error("No OUT endpoint found");
        }

        await new Promise<void>((resolve, reject) => {
            outEndpoint.transfer(data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        iface.release(true, () => {
            printer.close();
        });

        return "Data sent to printer successfully";
    } catch (error) {
        throw error;
    }
};


export async function printMagicCard(card: SlimCard) {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        width: 70-22,
        interface: "dummy", // Dummy interface since we're not using execute
        characterSet: CharacterSet.PC852_LATIN2,
        removeSpecialCharacters: false,
        lineCharacter: "-",
        breakLine: BreakLine.WORD,
    });



    printer.alignLeft();
    printer.println(card.name);
    printer.alignRight();
    printer.println(card.mana_cost);

    printer.alignCenter();
    printer.drawLine();
    // sometimes the art crop might not exist for a card
    if (card.image_uri) {
        try {
            const response = await fetch(card.image_uri).catch(_err => {console.error('couldnt get it')});
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const processed = await sharp(buffer)
                .resize(384, null, { withoutEnlargement: true })
                .grayscale()
                .png()
                .toBuffer();
            printer.printImageBuffer(processed);
            printer.newLine();
        } catch (error) {
            console.error("Failed to load image:", error);
        }
    }
    printer.drawLine();

    printer.alignLeft();
    printer.println(card.type_line);

    printer.drawLine();

    printer.alignLeft();
    printer.println(card.oracle_text);

    printer.newLine();
    printer.alignRight();
    printer.println(`${card.power}/${card.toughness}`);

    printer.cut();
    
    const buffer = printer.getBuffer();

    console.log("Printing...");
    try {
        const result = await printToUSBPrinter(buffer);
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}
