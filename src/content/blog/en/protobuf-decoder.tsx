import Link from 'next/link';

export default function ProtobufDecoderPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · July 12, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Decode and Inspect Protobuf Data Without a .proto File
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/protobuf-decoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Protobuf Decoder
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I was debugging a gRPC response and had the raw bytes but not the .proto schema. I needed to see what was inside.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Is Protobuf?</h2>

      <p className="mb-3">Protocol Buffers (Protobuf) is a binary serialization format developed by Google. It's used extensively in gRPC APIs, mobile app backends, and high-performance microservices where JSON's verbosity and parsing overhead aren't acceptable.</p>

      <p className="mb-3">The format is efficient — a Protobuf message is typically 3–10× smaller than equivalent JSON — but it's not human-readable. Protobuf-encoded data is binary; opening it in a text editor shows garbage characters.</p>

      <p className="mb-4">To decode Protobuf data, you normally need the .proto schema file that defines the message structure. Without it, you're looking at raw bytes with no field names and no type information.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need to Decode Protobuf</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Debugging gRPC requests and responses intercepted with a proxy (Charles, mitmproxy, Wireshark)</li>
        <li>Inspecting data stored in a binary format in a database or message queue</li>
        <li>Reverse engineering an API that uses Protobuf without publishing its .proto files</li>
        <li>Validating that your Protobuf encoder is producing the correct wire format</li>
        <li>Working with a third-party SDK that emits Protobuf data and something looks wrong</li>
        <li>Log analysis — binary log messages need to be decoded for human inspection</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Schema-Less Decoding — How It Works</h2>

      <p className="mb-3">Protobuf's wire format encodes field numbers and wire types, but not field names. Even without a .proto file, you can partially decode Protobuf data because the binary format always includes:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Field number (integer)</li>
        <li>Wire type → 0 = varint, 1 = 64-bit, 2 = length-delimited (string/bytes/embedded message), 5 = 32-bit</li>
        <li>Value (raw, without semantic interpretation)</li>
      </ul>

      <p className="mb-3">Schema-less decoding reads the wire format and shows you field numbers and raw values. You won't get field names — those only exist in the .proto file — but you can see the structure and values, which is often enough to debug an issue.</p>

      <p className="mb-4">This tool supports both schema-less decoding (paste bytes, see structure) and schema-based decoding (provide a .proto definition for full field name resolution).</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Decode Protobuf binary data from base64 or hex input</li>
        <li>Schema-less mode → parse wire format and display field numbers and values</li>
        <li>Schema mode → paste a .proto definition for full field name resolution</li>
        <li>Encode mode → convert JSON back into Protobuf binary (requires schema)</li>
        <li>Display decoded result as JSON-like structure</li>
        <li>All processing in the browser — binary data never leaves your device</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Input Formats</h2>

      <p className="mb-3">Protobuf binary data can come in different encodings depending on where you captured it:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Base64 → common in HTTP headers, API responses encoded as base64, and browser DevTools network captures</li>
        <li>Hex → common in packet captures (Wireshark), binary dumps, and low-level debugging</li>
        <li>Raw binary → uncommon in web contexts but supported via file upload</li>
      </ul>

      <p className="mb-4">Copy the base64 or hex string from wherever you captured it, paste it in, and the tool decodes it.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Schema-less decoding is genuinely useful for debugging without the .proto file</li>
        <li>No server upload — binary data with potential secrets stays local</li>
        <li>Encode and decode in one tool — useful for round-trip testing</li>
        <li>JSON output is easy to read and copy</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Schema-less mode can't recover field names — you get field numbers only</li>
        <li>Oneof and map types require schema for correct interpretation</li>
        <li>Proto3 default values are omitted on the wire — you can't distinguish "missing" from "zero/empty"</li>
        <li>Complex nested messages may need manual interpretation in schema-less mode</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste your base64 or hex-encoded Protobuf data</li>
        <li>Optionally paste your .proto schema for full decoding</li>
        <li>Click Decode</li>
        <li>Inspect the JSON-formatted output</li>
      </ol>

      <p className="mb-4">Takes about a minute, most of which is locating the bytes you want to decode.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/protobuf-decoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Protobuf Decoder
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Schema-less or schema-based. Nothing leaves your browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#protobuf` `#grpc` `#binary-decode` `#protocol-buffers` `#debugging`
      </p>
    </article>
  );
}
