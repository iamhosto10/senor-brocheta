/**
 * Escribe un texto como oración: solo la primera letra en mayúscula y el
 * resto en minúscula. Es la regla de estilo para todo lo que va con la
 * fuente Triumph Wheels Rough.
 */
export function oracion(texto: string) {
  const t = texto.toLocaleLowerCase("es");
  return t.charAt(0).toLocaleUpperCase("es") + t.slice(1);
}
