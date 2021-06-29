let port;
let reader;
let writer;
let readableStreamClosed;

class LineBreakTransformer {
    constructor() {
      this.container = '';
    }
  
    transform(chunk, controller) {
      this.container += chunk;
      const lines = this.container.split('\r\n');
      this.container = lines.pop();
      lines.forEach(line => controller.enqueue(line));
    }
  
    flush(controller) {
      controller.enqueue(this.container);
    }
  }

export const openConnection = async (baudRate_, newLine) => {
    
    //requesting port on the pop up window.
    port = window['port'];

    var options = {
        baudRate: baudRate_,
        parity: 'none',
        dataBits: 8,
        stopBits: 1,
        bufferSize: 1024,
      };
    
    // connect to port on baudRate 9600.
    await port.open(options);
    console.log(`port opened at baud rate: ${baudRate_} `);
    document.getElementById("console-content").innerHTML = ('');
    readUntilClose(newLine);
}

const readUntilClose = async (newLine) => {    
    const textDecoder = new window.TextDecoderStream();
    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    // reader = textDecoder.readable.getReader();
    reader = textDecoder.readable
        .pipeThrough(new window.TransformStream(new LineBreakTransformer()))
        .getReader();

    console.log("reader opened")
    let string = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
        // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
        }
        console.log(value);
        if(!newLine){
            string+=value;
            document.getElementById("console-content").innerHTML = string;
        }
        else{
            let newP = document.createElement('p');
            newP.innerHTML = value;
            newP.style.margin = 0;
            document.getElementById("console-content").appendChild(newP);
            newP.scrollIntoView();
        }
    }
}

export const writeToPort = async (data) => {
    const textEncoder = new window.TextEncoder();
    writer = port.writable.getWriter();
    data += '\n';
    await writer.write(textEncoder.encode(data));
    console.log(textEncoder.encode(data));
    writer.releaseLock();
}
  
export const disconnect = async () => {
    reader.cancel();
    await readableStreamClosed.catch(() => { /* Ignore the error */ });
    if(typeof writer !== "undefined")
    {
        const textEncoder = new window.TextEncoder();
        writer = port.writable.getWriter();
        await writer.write(textEncoder.encode(''));
        await writer.close();
    }
    await port.close();
}
