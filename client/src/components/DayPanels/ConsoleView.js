let reader;
let port;

export const openConnection = async () => {
    // Filter for arduino Uno
    const filters = [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
        { usbVendorId: 0x2341, usbProductId: 0x0001 }
      ];
    
    //requesting port on the pop up window.
    port = window['port'];

    if(typeof port === 'undefined'){
        console.log("no port selected");
        return port;
    }
    
    // connect to port on baudRate 9600.
    await port.open({ baudRate: 9600 });
    console.log("port opened")

    // const textDecoder = new TextDecoderStream();
    // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    // const reader = textDecoder.readable.getReader();
    readUntilClose();
}

const readUntilClose = async () => {
    const port = window['port'];
    
    // console.log(port.readable);
    reader = port.readable.getReader();
    console.log("reader opened")
    try{
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
            // Allow the serial port to be closed later.
                reader.releaseLock();
                break;
            }
            // value is a string.
            var string = new TextDecoder().decode(value);
            console.log(string);
        }
    }
    catch (error) {
        console.log(error);
    }
}

export const disconnect = async () => {
    if (reader) {
        await reader.cancel();
        reader = null;
    }
    await port.close();
    port = null;
}
