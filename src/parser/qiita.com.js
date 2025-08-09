export default function(cslData, url) {
  const pathParts = url.pathname.split('/').filter(p => p);

  if (pathParts.length >= 2) {
    const username = pathParts[0];
    const page_id = pathParts[1];

    cslData.type = 'webpage';
    cslData.title = `${username}/${document.title}`;
    cslData.author = [{ literal: username }];
    cslData.URL = `https://qiita.com/${username}/${page_id}`;

    delete cslData['container-title']; 
    delete cslData.publisher;
  }
  return cslData;
}
