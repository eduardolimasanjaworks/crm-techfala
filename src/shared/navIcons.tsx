/**
 * Ícones da sidebar esquerda (extraídos do dump Bubble).
 * Ativo usa fill rosa #F5008D via currentColor.
 */
type Props = { className?: string }

export function NavAssistente({ className }: Props) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7 10.2309L9.76923 13.0001C11.0586 12.5097 12.2956 11.8912 13.4615 11.154C18.28 7.92318 19 3.51088 19 1.00011C16.9717 0.987526 14.9739 1.49408 13.1966 2.47158C11.4193 3.44908 9.92171 4.86502 8.84615 6.58472C8.10973 7.73493 7.49121 8.9565 7 10.2309Z"
        fill="currentColor"
      />
      <path
        d="M9.76923 13.0001L7 10.2309M9.76923 13.0001C11.0586 12.5097 12.2956 11.8912 13.4615 11.154M9.76923 13.0001V17.6155C9.76923 17.6155 12.5662 17.1078 13.4615 15.7693C14.4585 14.274 13.4615 11.154 13.4615 11.154M7 10.2309C7.49121 8.9565 8.10973 7.73493 8.84615 6.58472C9.92171 4.86502 11.4193 3.44908 13.1966 2.47158C14.9739 1.49408 16.9717 0.987526 19 1.00011C19 3.51088 18.28 7.92318 13.4615 11.154M7 10.2309H2.38462C2.38462 10.2309 2.89231 7.43395 4.23077 6.53857C5.72615 5.54165 8.84615 6.53857 8.84615 6.53857M2.84615 14.3847C1.46154 15.5478 1 19.0001 1 19.0001C1 19.0001 4.45231 18.5386 5.61538 17.154C6.27077 16.3786 6.26154 15.1878 5.53231 14.4678C5.17351 14.1253 4.70089 13.9275 4.20513 13.9121C3.70938 13.8968 3.22542 14.0651 2.84615 14.3847Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NavCrm({ className }: Props) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="5" height="16" rx="1.5" fill="currentColor" />
      <rect x="10" y="8" width="5" height="12" rx="1.5" fill="currentColor" />
      <rect x="17" y="6" width="5" height="14" rx="1.5" fill="currentColor" />
    </svg>
  )
}

/** Ícones simples para os demais itens da nav (fiel ao papel, sem lib). */
export function NavSimple({
  className,
  paths,
}: Props & { paths: string[] }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {paths.map((d) => (
        <path key={d} d={d} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}
