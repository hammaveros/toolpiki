'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

const httpCodes = [
  // 1xx
  { code: 100, name: 'Continue', desc: 'Initial part of request received, continue sending', category: '1xx' },
  { code: 101, name: 'Switching Protocols', desc: 'Server is switching protocols as requested', category: '1xx' },
  // 2xx
  { code: 200, name: 'OK', desc: 'Request succeeded', category: '2xx' },
  { code: 201, name: 'Created', desc: 'Request succeeded, new resource created', category: '2xx' },
  { code: 202, name: 'Accepted', desc: 'Request accepted, processing not complete', category: '2xx' },
  { code: 204, name: 'No Content', desc: 'Request succeeded, no content to return', category: '2xx' },
  { code: 206, name: 'Partial Content', desc: 'Range request succeeded, partial content returned', category: '2xx' },
  // 3xx
  { code: 301, name: 'Moved Permanently', desc: 'Resource has permanently moved to new URL', category: '3xx' },
  { code: 302, name: 'Found', desc: 'Resource temporarily at different URL', category: '3xx' },
  { code: 303, name: 'See Other', desc: 'Response at different URI (use GET)', category: '3xx' },
  { code: 304, name: 'Not Modified', desc: 'Cached version is still valid', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', desc: 'Temporary redirect (preserve method)', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', desc: 'Permanent redirect (preserve method)', category: '3xx' },
  // 4xx
  { code: 400, name: 'Bad Request', desc: 'Invalid request syntax', category: '4xx' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication required', category: '4xx' },
  { code: 403, name: 'Forbidden', desc: 'Access denied', category: '4xx' },
  { code: 404, name: 'Not Found', desc: 'Resource not found', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', desc: 'HTTP method not allowed', category: '4xx' },
  { code: 408, name: 'Request Timeout', desc: 'Request took too long', category: '4xx' },
  { code: 409, name: 'Conflict', desc: 'Request conflicts with current state', category: '4xx' },
  { code: 410, name: 'Gone', desc: 'Resource permanently deleted', category: '4xx' },
  { code: 413, name: 'Payload Too Large', desc: 'Request body is too large', category: '4xx' },
  { code: 414, name: 'URI Too Long', desc: 'URI is too long', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', desc: 'Media type not supported', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', desc: 'Request understood but cannot process', category: '4xx' },
  { code: 429, name: 'Too Many Requests', desc: 'Rate limit exceeded', category: '4xx' },
  // 5xx
  { code: 500, name: 'Internal Server Error', desc: 'Server encountered an error', category: '5xx' },
  { code: 501, name: 'Not Implemented', desc: 'Feature not supported', category: '5xx' },
  { code: 502, name: 'Bad Gateway', desc: 'Gateway received invalid response', category: '5xx' },
  { code: 503, name: 'Service Unavailable', desc: 'Service temporarily unavailable', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', desc: 'Gateway timed out', category: '5xx' },
];

const categories = [
  { id: 'all', name: 'All', color: 'gray' },
  { id: '1xx', name: '1xx Info', color: 'blue' },
  { id: '2xx', name: '2xx Success', color: 'green' },
  { id: '3xx', name: '3xx Redirect', color: 'yellow' },
  { id: '4xx', name: '4xx Client Error', color: 'orange' },
  { id: '5xx', name: '5xx Server Error', color: 'red' },
];

export function HttpStatusCodeEn() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCodes = useMemo(() => {
    return httpCodes.filter((code) => {
      const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;
      const matchesSearch = search === '' ||
        code.code.toString().includes(search) ||
        code.name.toLowerCase().includes(search.toLowerCase()) ||
        code.desc.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '1xx': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case '2xx': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case '3xx': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case '4xx': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case '5xx': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or name..."
          className="flex-1 min-w-48 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === cat.id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filteredCodes.map((item) => (
          <Card key={item.code} variant="bordered" className="p-4">
            <div className="flex items-start gap-4">
              <span className={`px-3 py-1 rounded-lg font-mono font-bold ${getCategoryColor(item.category)}`}>
                {item.code}
              </span>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No results found
        </div>
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
          🌐 What are HTTP Status Codes?
        </h2>
        <p className="text-sm leading-relaxed">
          HTTP status codes are 3-digit numbers indicating how the server processed a client request.
          Defined in HTTP standards like RFC 7231, the first digit indicates the response category.
          1xx is informational, 2xx is success, 3xx is redirection, 4xx is client error, and 5xx is server error.
          Developers use these codes for API debugging, error handling, and logging.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Category Meanings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span className="font-medium text-blue-700 dark:text-blue-300">1xx Informational</span>
            <p className="text-xs text-gray-500 mt-1">Request received, continue</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <span className="font-medium text-green-700 dark:text-green-300">2xx Success</span>
            <p className="text-xs text-gray-500 mt-1">Request processed successfully</p>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <span className="font-medium text-yellow-700 dark:text-yellow-300">3xx Redirection</span>
            <p className="text-xs text-gray-500 mt-1">Further action needed</p>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <span className="font-medium text-orange-700 dark:text-orange-300">4xx Client Error</span>
            <p className="text-xs text-gray-500 mt-1">Bad request</p>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded sm:col-span-2">
            <span className="font-medium text-red-700 dark:text-red-300">5xx Server Error</span>
            <p className="text-xs text-gray-500 mt-1">Server processing failed</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Common Status Codes
        </h2>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li><strong>200 OK</strong> - Success, most common response</li>
          <li><strong>201 Created</strong> - New resource created via POST</li>
          <li><strong>400 Bad Request</strong> - Invalid parameters or body</li>
          <li><strong>401/403</strong> - Authentication/authorization issues</li>
          <li><strong>404 Not Found</strong> - Resource not found</li>
          <li><strong>500 Internal Server Error</strong> - Server internal error</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between 401 and 403?',
            answer: '401 Unauthorized means authentication is required or failed (need to log in). 403 Forbidden means authenticated but no permission for the resource.',
          },
          {
            question: 'What is the difference between 302 and 307?',
            answer: '302 Found historically caused browsers to change POST to GET on redirect. 307 Temporary Redirect preserves the original HTTP method.',
          },
          {
            question: 'Can I create custom status codes?',
            answer: 'Possible but not recommended. Use standard codes and include details in the response body. Some vendors have extensions like 499 (Nginx), 520-527 (Cloudflare).',
          },
        ]}
      />
    </div>
  );
}
