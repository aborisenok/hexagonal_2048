export const redirectTo = (url, queryObj) => {
  let query = '';
  if (queryObj) {
    query = `/?${new URLSearchParams(queryObj).toString()}`;
  }

  window.location.href = url + query 
}

export const reloadPage = () => {
  window.location.reload();
}

