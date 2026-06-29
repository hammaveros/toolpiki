import Link from 'next/link';

export default function FileSizeCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 22일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        GB가 KB로 몇 개야? 파일 크기 단위 변환기 만든 이유
      </h1>

      <p className="mb-4">
        <Link href="/tools/file-size-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 파일 크기 단위 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API 응답 크기가 2.3MB라고 나오는데 이게 KB로 몇 개짜리인지, 네트워크 비용으로 따지면 얼마인지 바로 안 잡혀서 만들었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">파일 크기 단위 변환이 필요한 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>개발 중 → API 응답 크기 확인, 번들 사이즈 체크</li>
        <li>클라우드 스토리지 → S3, GCS 용량 계산 (GB로 보이는 것들)</li>
        <li>이메일 첨부 파일 → 첨부 한도가 25MB면 내 파일이 가능한지</li>
        <li>동영상 업로드 → 유튜브 15분 이하, 파일 256GB 이하 제한 확인</li>
        <li>SSD/HDD 용량 비교 → 1TB SSD에 파일들이 다 들어가는지</li>
        <li>모바일 데이터 관리 → 1GB 요금제로 HD 영상 몇 분 볼 수 있는지</li>
        <li>데이터베이스 → 테이블 용량이 몇 GB인지, 백업 파일 크기</li>
        <li>이미지 최적화 → 원본 3MB를 300KB로 줄이면 압축률 몇 %</li>
      </ul>

      <p className="mb-4">개발자뿐만 아니라 일반 사용자도 클라우드, 이메일, 파일 관리하다 보면 GB, MB, KB가 뒤섞인다. 1GB가 1,024MB인지 1,000MB인지도 헷갈리는 사람 많음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글 검색 → "1 GB in MB" 치면 나오긴 하는데 여러 단위 동시에 안 보임</li>
        <li>계산기 앱 → 1024 몇 번 곱하거나 나눠야 하는지 기억하기 귀찮음</li>
        <li>암산 → 2.3MB는 몇 KB인지 순간 안 나옴 (× 1024이지만 소수점 있으면 더 복잡)</li>
        <li>단위 변환 앱 → 파일 크기 카테고리가 있긴 한데 UI가 불친절함</li>
      </ul>

      <p className="mb-4">그리고 1024 기반(이진 접두사)이랑 1000 기반(십진 접두사) 혼용이 진짜 혼란스럽다. 하드디스크 1TB를 사면 실제로 포맷하면 931GB 정도로 뜨는 이유가 이거임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">숫자 하나 넣으면 모든 단위가 한 번에 나온다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 단위:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Bit (비트)</li>
        <li>Byte (바이트)</li>
        <li>KB (킬로바이트)</li>
        <li>MB (메가바이트)</li>
        <li>GB (기가바이트)</li>
        <li>TB (테라바이트)</li>
        <li>PB (페타바이트)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">이진/십진 모두 지원:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이진 (1024 기반) → KiB, MiB, GiB, TiB</li>
        <li>십진 (1000 기반) → KB, MB, GB, TB</li>
        <li>둘 다 표시해서 차이 바로 확인 가능</li>
      </ul>

      <p className="mb-4">어느 단위로든 입력 가능하다. MB에 값 넣으면 다른 단위들이 전부 자동으로 갱신됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1024 기반 vs 1000 기반, 왜 다른가</h2>

      <p className="mb-3">컴퓨터는 2진수 기반이라 1024(2^10)가 단위 기준이다. 하지만 하드디스크 제조사들은 마케팅 목적으로 1000 기반을 쓴다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">실제 차이:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1 KB = 1,024 Bytes (이진) vs 1,000 Bytes (십진)</li>
        <li>1 MB = 1,048,576 Bytes (이진) vs 1,000,000 Bytes (십진)</li>
        <li>1 GB = 1,073,741,824 Bytes (이진) vs 1,000,000,000 Bytes (십진)</li>
        <li>1 TB = 1,099,511,627,776 Bytes (이진) vs 1,000,000,000,000 Bytes (십진)</li>
      </ul>

      <p className="mb-3">TB 단위가 되면 이진 기준으로는 1,099GB이고 십진 기준으로는 1,000GB이다. 차이가 약 10% 발생함.</p>

      <p className="mb-3">그래서 "1TB HDD 샀는데 왜 931GB로 나와?" 현상이 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HDD 제조사 표기: 1TB = 1,000,000,000,000 Bytes (십진)</li>
        <li>OS가 표시하는 1TB 기준: 1,099,511,627,776 Bytes (이진)</li>
        <li>1,000,000,000,000 ÷ 1,099,511,627,776 ≈ 0.909 → 약 931GiB</li>
      </ul>

      <p className="mb-4">제조사가 속이는 게 아니고 단위 기준이 달라서 그렇다. 이 계산기로 확인해볼 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>숫자 넣으면 Bit부터 PB까지 전부 동시 표시</li>
        <li>이진/십진 둘 다 보여줌 → 차이 한눈에 비교 가능</li>
        <li>소수점 입력 가능 → 2.3MB, 0.5GB 같은 값도 됨</li>
        <li>어느 단위에서든 입력 가능 → TB에 넣어도 되고 KB에 넣어도 됨</li>
        <li>개발할 때 유용 → 바이트 수 넣으면 사람이 읽기 좋은 크기로 변환</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>네트워크 속도(Mbps) 기반 전송 시간 계산은 없음 → 파일 단위 변환에만 특화</li>
        <li>파일 개수 × 크기 계산 같은 복합 계산은 직접 해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">개발자한테 특히 유용한 상황</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 응답 크기 모니터링 → 2,387,456 Bytes를 사람이 읽기 좋게 변환</li>
        <li>S3 버킷 용량 계획 → 파일 1개가 평균 몇 MB인지 TB로 환산</li>
        <li>이미지 최적화 목표 설정 → 원본 3.2MB를 500KB 이하로 줄이기</li>
        <li>데이터베이스 인덱스 크기 → 바이트 수로 나오는 쿼리 결과 읽기</li>
        <li>도커 이미지 크기 최적화 → 레이어별 용량 체크</li>
        <li>nginx/apache 로그 크기 → 일별 로그 파일이 GB로 커지는 속도 파악</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>단위 선택 (Byte, KB, MB, GB 중 하나)</li>
        <li>숫자 입력</li>
        <li>모든 단위 결과 동시에 확인</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">10초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/file-size-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 파일 크기 단위 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음에 HDD 용량이 왜 다르게 표시되는지 궁금하면 1000 기반 vs 1024 기반 직접 넣어서 확인해봐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #파일크기변환 #GB를MB로 #KB변환기 #데이터단위변환 #개발자도구
      </p>
    </article>
  );
}
