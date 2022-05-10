// export function request(url, method = 'GET') {
//   const xhr = new XMLHttpRequest();

//   // Do whatever you want to the xhr... add headers etc

//   return new Promise((res, rej) => {
//     xhr.open(method, url);
//     xhr.onload = () => {
//       // Do whatever you want on load...
//       console.log('Do whatever we want...');
//       //   if (xhr.status !== 200) {
//       //     return rej('Upload failed. Response code:' + xhr.status);
//       //   }
//       //   return res(xhr.responseText);
//     };
//     xhr.send();
//   });
// }

const REQUEST_ARGUMENTS = Symbol();
const REQUEST_HANDLER = Symbol();

async function handleRequest(request) {
  //   const pollyRequest = this.polly.registerRequest(request);

  try {
    pollyRequest.on('identify', (...args) => this.onIdentifyRequest(...args));

    await this.onRequest(pollyRequest);
    await pollyRequest.init();
    await this[REQUEST_HANDLER](pollyRequest);

    if (pollyRequest.aborted) {
      console.error('Error0');
      //   throw new PollyError('Request aborted.');
    }

    await this.onRequestFinished(pollyRequest);
  } catch (error) {
    await this.onRequestFailed(pollyRequest, error);
  }

  return pollyRequest;
}

export function mockFetch(url, options = {}) {
  let respond;

  // Support Request object
  if (typeof url === 'object' && url[REQUEST_ARGUMENTS]) {
    const req = url;
    const reqArgs = req[REQUEST_ARGUMENTS];

    url = reqArgs.url;
    options = {...reqArgs.options, ...options};

    // If a body exists in the Request instance, mimic reading the body
    // if ('body' in reqArgs.options) {
    //   defineProperty(req, 'bodyUsed', {value: true});
    // }
  }

  const promise = new Promise((resolve, reject) => {
    respond = ({response, error}) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    };
  });

  //   this.handleRequest({
  handleRequest({
    url,
    method: options.method || 'GET',
    // headers: serializeHeaders(new context.Headers(options.headers)),
    body: options.body,
    requestArguments: {options, respond},
  });

  return promise;
}
