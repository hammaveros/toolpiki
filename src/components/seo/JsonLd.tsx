interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LD 구조화 데이터 컴포넌트
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
