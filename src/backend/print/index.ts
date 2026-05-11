const {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
    BreakLine,
} = require("node-thermal-printer");
import type { SlimCard } from "@/shared/cards/slim-card.model";
import { getDeviceList } from "usb";

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

export const testPrint = async () => {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        width: 70,
        interface: "dummy", // Dummy interface since we're not using execute
        characterSet: CharacterSet.PC852_LATIN2,
        removeSpecialCharacters: false,
        lineCharacter: "=",
        breakLine: BreakLine.WORD,
    });

    printer.alignCenter();
    printer.println("Test Receipt");
    printer.drawLine();
    printer.println("Item 1 x 15 $15.00");
    printer.println("Item 2 x 1 $75.00");
    printer.drawLine();
    printer.println("Total: $90.00");
    printer.newLine();
    printer.cut();

    const buffer = printer.getBuffer();

    console.log("Printing...");
    try {
        const result = await printToUSBPrinter(buffer);
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
};

export async function printMagicCard(card: SlimCard) {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        width: 70,
        interface: "dummy", // Dummy interface since we're not using execute
        characterSet: CharacterSet.PC852_LATIN2,
        removeSpecialCharacters: false,
        lineCharacter: "=",
        breakLine: BreakLine.WORD,
    });
    printer.alignLeft();
    printer.print(card.name);
    printer.alignRight();
    printer.print(card.mana_cost);
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
