'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
}

export function IpLookup() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIpInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) throw new Error('IP 정보를 가져올 수 없습니다');
      const data = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IP 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={fetchIpInfo} disabled={loading}>
          {loading ? '조회 중...' : '다시 조회'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {ipInfo && (
        <Card variant="bordered" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">내 IP 주소</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {ipInfo.ip}
                </span>
                <CopyButton text={ipInfo.ip} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {ipInfo.city && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">도시</span>
                  <p className="font-medium">{ipInfo.city}</p>
                </div>
              )}
              {ipInfo.region && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">지역</span>
                  <p className="font-medium">{ipInfo.region}</p>
                </div>
              )}
              {ipInfo.country && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">국가</span>
                  <p className="font-medium">{ipInfo.country}</p>
                </div>
              )}
              {ipInfo.loc && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">좌표</span>
                  <p className="font-medium font-mono text-sm">{ipInfo.loc}</p>
                </div>
              )}
              {ipInfo.org && (
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">ISP/조직</span>
                  <p className="font-medium">{ipInfo.org}</p>
                </div>
              )}
              {ipInfo.timezone && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">타임존</span>
                  <p className="font-medium">{ipInfo.timezone}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌐 IP 주소 조회란?
        </h2>
        <p className="text-sm leading-relaxed">
          IP 주소 조회는 현재 인터넷에 연결된 기기의 공인 IP 주소와 위치 정보를 확인하는 도구입니다.
          인터넷 서비스 제공업체(ISP), 도시, 지역, 국가, 좌표, 타임존 등 다양한 정보를 표시합니다.
          VPN이나 프록시가 정상 작동하는지 확인하거나, 원격 접속 설정 시 자신의 IP를 파악하는 데 유용합니다.
          ipinfo.io API를 통해 실시간으로 조회하며, 브라우저에서 바로 확인 가능합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 IP 주소 정보 항목
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">IP 주소</td><td>공인 IP (IPv4/IPv6)</td><td>원격 접속 설정, 서버 화이트리스트</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">도시/지역</td><td>대략적인 위치</td><td>VPN 접속 지역 확인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">국가</td><td>ISO 국가 코드</td><td>지역 제한 콘텐츠 접근 확인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">좌표</td><td>위도, 경도</td><td>대략적 위치 파악 (정확도 낮음)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">ISP/조직</td><td>인터넷 서비스 제공업체</td><td>네트워크 문제 신고 시 참고</td></tr>
              <tr><td className="py-2 px-2 font-medium">타임존</td><td>시간대 정보</td><td>서버 시간 동기화 확인</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 IP 주소 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>VPN 확인</strong>: VPN 연결 후 IP와 국가가 변경되었는지 확인</li>
          <li><strong>공유기 설정</strong>: 포트포워딩, DDNS 설정 시 공인 IP 필요</li>
          <li><strong>보안 점검</strong>: 의심스러운 접속 로그의 IP와 자신의 IP 비교</li>
          <li><strong>원격 접속</strong>: 외부에서 집/회사 접속 시 IP 주소 파악</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '내 IP 주소가 정확한 위치를 보여주나요?',
            answer: 'IP 기반 위치는 ISP 데이터센터 위치를 기준으로 하므로 정확한 주소가 아닌 대략적인 도시/지역 수준입니다. 실제 위치와 수십 km 차이가 날 수 있습니다.',
          },
          {
            question: 'IP 주소가 다른 사람에게 공개되면 위험한가요?',
            answer: 'IP 주소만으로는 정확한 주소나 개인정보를 알 수 없습니다. 다만 DDoS 공격의 대상이 될 수 있으므로 신뢰할 수 없는 곳에 공개하지 않는 것이 좋습니다.',
          },
          {
            question: 'IPv4와 IPv6의 차이는 무엇인가요?',
            answer: 'IPv4는 192.168.0.1 형식의 32비트 주소이고, IPv6는 2001:db8::1 형식의 128비트 주소입니다. IPv4 주소 고갈로 인해 IPv6로 전환 중이며, 대부분의 ISP는 두 가지를 모두 지원합니다.',
          },
        ]}
      />
    </div>
  );
}
