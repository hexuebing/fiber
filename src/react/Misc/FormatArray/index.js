export default function formatArray(arg){
  return Array.isArray(arg) ? arg : [arg]
}