export default function(cslData, url) {
  const pathParts = url.pathname.split('/').filter(p => p);

  if (pathParts.length >= 2) {
    const username = pathParts[0];
    const document_type = pathParts[1]; // 例: "articles" や "books"
    const page_id = pathParts[2];

    cslData.type = 'webpage';
    cslData.title = `${username}/${document.title}`;
    cslData.author = [{ literal: username }];
    cslData.URL = `https://zenn.dev/${username}/${document_type}/${page_id}`;

    delete cslData['container-title']; 
    delete cslData.publisher;
  }
  return cslData;
}
