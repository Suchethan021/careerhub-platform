import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowUp, FiArrowDown, FiSave, FiHelpCircle, FiTrash2 } from 'react-icons/fi';
import type { ContentSection, FAQ } from '../../types';
import { getContentSectionsByCompanyId, saveContentSections } from '../../services/contentSectionService';
import { getFaqsByCompanyId, saveFaqs } from '../../services/faqService';

interface ContentFaqManagerProps {
  companyId: string;
}

const SECTION_TYPES: { type: ContentSection['type']; label: string; placeholder: string }[] = [
  { type: 'about', label: 'About Us', placeholder: 'Share a short story about your company.' },
  { type: 'mission', label: 'Mission', placeholder: 'Explain your mission and what you are trying to achieve.' },
  { type: 'life', label: 'Life at Company', placeholder: 'Describe what day-to-day life looks like.' },
  { type: 'perks', label: 'Perks & Benefits', placeholder: 'List key benefits and perks for employees.' },
  { type: 'team', label: 'The Team', placeholder: 'Talk about your team, values, and collaboration style.' },
];

export function ContentFaqManager({ companyId }: ContentFaqManagerProps) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      const [sectionsResult, faqsResult] = await Promise.all([
        getContentSectionsByCompanyId(companyId),
        getFaqsByCompanyId(companyId),
      ]);

      if (!mounted) return;

      if (sectionsResult.error) {
        setError(sectionsResult.error);
      } else {
        setSections(sectionsResult.data || []);
      }

      if (faqsResult.error) {
        setError((prev) => prev || faqsResult.error);
      } else {
        setFaqs(faqsResult.data || []);
      }

      setIsLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [companyId]);

  const ensureSectionDefaults = (
    type: ContentSection['type'],
    indexHint: number,
  ): ContentSection => {
    return {
      id: crypto.randomUUID(),
      company_id: companyId,
      type,
      order_index: indexHint,
      is_visible: true,
      title: '',
      content: '',
      image_urls: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      updated_by: null,
      deleted_at: null,
    };
  };

  const updateSectionField = (
    type: ContentSection['type'],
    field: keyof ContentSection,
    value: unknown,
  ) => {
    setSections((prev) => {
      const existing = prev.find((s) => s.type === type);
      if (!existing) {
        const newSection = ensureSectionDefaults(type, prev.length);
        return [
          ...prev,
          { ...newSection, [field]: value } as ContentSection,
        ];
      }

      return prev.map((section) =>
        section.type === type ? ({ ...section, [field]: value } as ContentSection) : section,
      );
    });
  };

  const moveSection = (type: ContentSection['type'], direction: -1 | 1) => {
    setSections((prev) => {
      // Work on a sorted copy so order_index stays meaningful
      const active = [...prev].filter((s) => !s.deleted_at).sort((a, b) => a.order_index - b.order_index);
      const index = active.findIndex((s) => s.type === type);
      if (index === -1) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= active.length) return prev;

      const tmp = active[index].order_index;
      active[index].order_index = active[targetIndex].order_index;
      active[targetIndex].order_index = tmp;

      // Map updated order_index back onto original array
      return prev.map((section) => {
        const updated = active.find((s) => s.id === section.id);
        return updated || section;
      });
    });
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    setFaqs((prev) => {
      const newFaqs = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newFaqs.length) return prev;
      const [removed] = newFaqs.splice(index, 1);
      newFaqs.splice(targetIndex, 0, removed);
      return newFaqs.map((faq, idx) => ({ ...faq, order_index: idx }));
    });
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) =>
      prev.map((faq, idx) =>
        idx === index ? { ...faq, deleted_at: new Date().toISOString() } : faq,
      ),
    );
  };

  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        company_id: companyId,
        question: '',
        answer: '',
        order_index: prev.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
        updated_by: null,
        deleted_at: null,
      },
    ]);
  };

  const updateFaqField = (index: number, field: keyof FAQ, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, idx) => (idx === index ? { ...faq, [field]: value } : faq)),
    );
  };

  const saveAll = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const activeSections = sections.filter((s) => !s.deleted_at);
    const sortedSections = [...activeSections].sort((a, b) => a.order_index - b.order_index);
    const cleanSections = sortedSections.map((s, index) => ({ ...s, order_index: index }));

    const typeCounts = new Map<ContentSection['type'], number>();
    for (const section of cleanSections) {
      const type = section.type;
      if (!type) continue;
      const current = typeCounts.get(type) ?? 0;
      typeCounts.set(type, current + 1);
    }

    const duplicateTypes = Array.from(typeCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([type]) => type);

    if (duplicateTypes.length > 0) {
      const duplicateLabels = duplicateTypes
        .map((type) => SECTION_TYPES.find((config) => config.type === type)?.label || type)
        .join(', ');
      setError(
        `Each section type can only appear once. Please fix duplicates for: ${duplicateLabels}.`,
      );
      setIsSaving(false);
      return;
    }

    const orderedFaqs = faqs.map((f, index) => ({ ...f, order_index: index }));

    const [sectionsResult, faqsResult] = await Promise.all([
      saveContentSections(companyId, cleanSections),
      saveFaqs(companyId, orderedFaqs),
    ]);

    if (sectionsResult.error || faqsResult.error) {
      setError(sectionsResult.error || faqsResult.error || 'Failed to save content.');
    } else {
      setSections(sectionsResult.data || []);
      setFaqs(faqsResult.data || []);
      setSuccess('Content and FAQs saved.');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 text-sm text-gray-600">
        Loading content sections and FAQs...
      </div>
    );
  }

  const visibleFaqs = faqs.filter((faq) => !faq.deleted_at);

  const orderedSectionConfigs = [...SECTION_TYPES].sort((a, b) => {
    const sectionA = sections.find((s) => s.type === a.type && !s.deleted_at);
    const sectionB = sections.find((s) => s.type === b.type && !s.deleted_at);
    const orderA = sectionA?.order_index ?? 999;
    const orderB = sectionB?.order_index ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiHelpCircle />
          Page content & FAQs
        </h2>
        <button
          type="button"
          onClick={saveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FiSave />
          {isSaving ? 'Saving...' : 'Save content'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orderedSectionConfigs.map((config, index) => {
          const section = sections.find((s) => s.type === config.type);
          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{config.label}</p>
                  <p className="text-xs text-gray-500">
                    Optional section shown on your public careers page. Order:{' '}
                    <span className="font-mono">#{(section?.order_index ?? index) + 1}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(config.type, -1)}
                      className="p-1 rounded border border-gray-300 text-gray-500 hover:bg-white disabled:opacity-40"
                      disabled={section?.order_index === 0}
                    >
                      <FiArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(config.type, 1)}
                      className="p-1 rounded border border-gray-300 text-gray-500 hover:bg-white disabled:opacity-40"
                      disabled={section == null}
                    >
                      <FiArrowDown size={14} />
                    </button>
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={section ? section.is_visible : true}
                      onChange={(e) => updateSectionField(config.type, 'is_visible', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    Show section
                  </label>
                </div>
              </div>

              <input
                type="text"
                value={section?.title || ''}
                onChange={(e) => updateSectionField(config.type, 'title', e.target.value)}
                placeholder={config.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <textarea
                value={section?.content || ''}
                onChange={(e) => updateSectionField(config.type, 'content', e.target.value)}
                rows={4}
                placeholder={config.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            FAQs
          </h3>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <FiPlus /> Add FAQ
          </button>
        </div>

        {visibleFaqs.length === 0 ? (
          <p className="text-sm text-gray-500">You haven&apos;t added any FAQs yet. Use the button above to add common candidate questions.</p>
        ) : (
          <div className="space-y-4">
            {visibleFaqs.map((faq, index) => {
              const originalIndex = faqs.findIndex((f) => f.id === faq.id);
              return (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveFaq(originalIndex, -1)}
                        className="p-1 rounded border border-gray-300 text-gray-500 hover:bg-white disabled:opacity-40"
                        disabled={index === 0}
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFaq(originalIndex, 1)}
                        className="p-1 rounded border border-gray-300 text-gray-500 hover:bg-white disabled:opacity-40"
                        disabled={index === visibleFaqs.length - 1}
                      >
                        <FiArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(originalIndex)}
                        className="p-1 rounded border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaqField(originalIndex, 'question', e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaqField(originalIndex, 'answer', e.target.value)}
                    rows={3}
                    placeholder="Answer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
