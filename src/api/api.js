
//const base = 'http://apiilms.iecez.com';
const base = process.env.NODE_ENV == 'development'?'/apis':'http://apiilms.iecez.com';

export default base;