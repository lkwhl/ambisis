export default function Loading({ title }: { title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 text-lg font-medium">
          {title}
        </p>
      </div>
    </div>
  );
}
