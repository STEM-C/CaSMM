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
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.container);
  }
}

export const openConnection = async (
  baudRate_,
  type,
  plotData,
  setPlotData,
  plotId,
  forceUpdate
) => {
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
  document.getElementById('console-content').innerHTML = '';
  readUntilClose(type, plotData, setPlotData, plotId, forceUpdate);
};

const readUntilClose = async (
  type,
  plotData,
  setPlotData,
  plotId,
  forceUpdate
) => {
  const textDecoder = new window.TextDecoderStream();
  readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  // reader = textDecoder.readable.getReader();
  reader = textDecoder.readable
    .pipeThrough(new window.TransformStream(new LineBreakTransformer()))
    .getReader();

  let string = '';

  plotData = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      reader.releaseLock();
      break;
    }
    if (type === 'notNewLine') {
      string += value;
      document.getElementById('console-content').innerHTML = string;
    } else if (type === 'newLine') {
      let newP = document.createElement('p');
      newP.innerHTML = value;
      newP.style.margin = 0;
      document.getElementById('console-content').appendChild(newP);
      newP.scrollIntoView();
    } else {
      if (!isNaN(value)) {
        if (plotData.length > 200) {
          plotData.shift();
        }
        plotData.push({ id: plotId, input: parseInt(value) });
        plotId += 1;
        setPlotData(plotData);
        forceUpdate();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }
};

export const writeToPort = async (data) => {
  const textEncoder = new window.TextEncoder();
  writer = port.writable.getWriter();
  data += '\n';
  await writer.write(textEncoder.encode(data));
  writer.releaseLock();
};

export const disconnect = async () => {
  reader.cancel();
  await readableStreamClosed.catch(() => {
    /* Ignore the error */
  });
  if (typeof writer !== 'undefined') {
    const textEncoder = new window.TextEncoder();
    writer = port.writable.getWriter();
    await writer.write(textEncoder.encode(''));
    await writer.close();
  }
  await port.close();
};

export const connectToPort = async () => {
  const filters = [
    { usbVendorId: 0x2341, usbProductId: 0x0043 },
    { usbVendorId: 0x2341, usbProductId: 0x0001 },
  ];
  try {
    port = await navigator.serial.requestPort({ filters });
  } catch (e) {
    console.error(e);
    return;
  }
  window['port'] = port;
};

export const handleOpenConnection = async (
  baudRate,
  type,
  plotData,
  setPlotData,
  plotId,
  forceUpdate
) => {
  if (typeof window['port'] === 'undefined') {
    await connectToPort();
    if (typeof window['port'] === 'undefined') {
      return;
    }
  }
  await openConnection(
    baudRate,
    type,
    plotData,
    setPlotData,
    plotId,
    forceUpdate
  );
};

export const handleCloseConnection = async () => {
  console.log('Close connection');
  disconnect();
};
