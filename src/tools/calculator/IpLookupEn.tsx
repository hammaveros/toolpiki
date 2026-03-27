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

export function IpLookupEn() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIpInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) throw new Error('Failed to fetch IP info');
      const data = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IP lookup failed');
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
          {loading ? 'Loading...' : 'Refresh'}
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
              <span className="text-sm text-gray-500 dark:text-gray-400">Your IP Address</span>
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">City</span>
                  <p className="font-medium">{ipInfo.city}</p>
                </div>
              )}
              {ipInfo.region && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Region</span>
                  <p className="font-medium">{ipInfo.region}</p>
                </div>
              )}
              {ipInfo.country && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Country</span>
                  <p className="font-medium">{ipInfo.country}</p>
                </div>
              )}
              {ipInfo.loc && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Coordinates</span>
                  <p className="font-medium font-mono text-sm">{ipInfo.loc}</p>
                </div>
              )}
              {ipInfo.org && (
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">ISP/Organization</span>
                  <p className="font-medium">{ipInfo.org}</p>
                </div>
              )}
              {ipInfo.timezone && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Timezone</span>
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
          🌐 What is IP Lookup?
        </h2>
        <p className="text-sm leading-relaxed">
          IP Lookup displays your public IP address and geolocation information for your current internet connection.
          It shows details like ISP, city, region, country, coordinates, and timezone.
          Useful for verifying VPN connections, setting up remote access, or troubleshooting network issues.
          Data is fetched in real-time from ipinfo.io API directly in your browser.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 IP Information Fields
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Field</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">IP Address</td><td>Public IP (IPv4/IPv6)</td><td>Remote access, server whitelisting</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">City/Region</td><td>Approximate location</td><td>VPN location verification</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Country</td><td>ISO country code</td><td>Geo-restricted content access</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Coordinates</td><td>Latitude, longitude</td><td>Rough location (low accuracy)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">ISP/Org</td><td>Internet service provider</td><td>Network issue reporting</td></tr>
              <tr><td className="py-2 px-2 font-medium">Timezone</td><td>Time zone info</td><td>Server time synchronization</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 IP Address Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>VPN verification</strong>: Check if IP and country change after connecting to VPN</li>
          <li><strong>Router setup</strong>: Public IP needed for port forwarding and DDNS</li>
          <li><strong>Security audit</strong>: Compare suspicious login IPs with your own</li>
          <li><strong>Remote access</strong>: Know your IP for connecting from outside</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does my IP address show my exact location?',
            answer: 'IP-based geolocation is based on ISP data center locations, showing only approximate city/region level. Actual location can differ by tens of kilometers from the displayed location.',
          },
          {
            question: 'Is it dangerous if my IP address is exposed?',
            answer: 'An IP address alone cannot reveal your exact address or personal information. However, it could be targeted for DDoS attacks, so avoid sharing it in untrusted places.',
          },
          {
            question: 'What is the difference between IPv4 and IPv6?',
            answer: 'IPv4 uses 32-bit addresses like 192.168.0.1, while IPv6 uses 128-bit addresses like 2001:db8::1. Due to IPv4 exhaustion, the internet is transitioning to IPv6, and most ISPs support both.',
          },
        ]}
      />
    </div>
  );
}
