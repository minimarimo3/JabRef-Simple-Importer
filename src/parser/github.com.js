export default function(cslData, url) {
  const pathParts = url.pathname.split('/').filter(p => p);

  if (pathParts.length >= 2) {
    const username = pathParts[0];
    const product_name = pathParts[1];

    cslData.type = 'webpage';
    cslData.title = `${username}/${document.title}`;
    cslData.author = [{ literal: username }];
    cslData.URL = url.href;

    delete cslData['container-title']; 
    delete cslData.publisher;
  }
  return cslData;
}
