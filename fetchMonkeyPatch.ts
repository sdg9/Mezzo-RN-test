// const {fetch: originalFetch} = ;
const originalFetch = fetch;

global.fetch = async (...args) => {
  let [resource, config] = args;
  console.log('[Fetch request interceptor] URI: ', resource);
  console.log('[Fetch request interceptor] config: ', config);
  //   // request interceptor here
  const response = await originalFetch(resource, config);
  console.log('[Fetch response interceptor]: ', response);
  //   // response interceptor here
  return response;
};

export default global.fetch;
