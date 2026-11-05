export function getQueryParams(searchParams:{
  page?:string
}){

  const rawPage = searchParams.page
  let page
  if (rawPage === undefined){
   page = 1
  } else {
   const parsedPage = Number(rawPage)
   page = Number.isNaN(parsedPage) ? 0 : parsedPage
  }

  return {page}
}