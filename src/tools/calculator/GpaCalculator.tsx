'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const GRADE_SCALE: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

interface Course {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: '3', grade: 'A' },
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: '', credits: '3', grade: 'A' },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const credits = parseFloat(course.credits) || 0;
      const gradePoints = GRADE_SCALE[course.grade] ?? 0;

      totalCredits += credits;
      totalPoints += credits * gradePoints;
    });

    if (totalCredits === 0) return 0;
    return totalPoints / totalCredits;
  };

  const gpa = calculateGPA();
  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gpa >= 2.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.9) return 'Summa Cum Laude';
    if (gpa >= 3.7) return 'Magna Cum Laude';
    if (gpa >= 3.5) return 'Cum Laude';
    if (gpa >= 3.0) return 'Dean\'s List';
    if (gpa >= 2.0) return 'Good Standing';
    return 'Academic Probation';
  };

  return (
    <div className="space-y-2">
      {/* Courses */}
      <Card variant="bordered" className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Your Courses
          </h3>
          <Button onClick={addCourse} size="sm">
            + Add Course
          </Button>
        </div>

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-3">Grade</div>
            <div className="col-span-2"></div>
          </div>

          {courses.map((course) => (
            <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="Course name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  min="0"
                  max="6"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {Object.keys(GRADE_SCALE).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => removeCourse(course.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={courses.length === 1}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Results */}
      <Card variant="bordered" className="p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Your GPA
          </p>
          <div className={`text-5xl font-bold mb-2 ${getGpaColor(gpa)}`}>
            {gpa.toFixed(2)}
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {getGpaLabel(gpa)}
          </p>

          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {totalCredits}
              </span>{' '}
              Credits
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {courses.length}
              </span>{' '}
              Courses
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <CopyButton text={`GPA: ${gpa.toFixed(2)} (${totalCredits} credits)`} />
          </div>
        </div>
      </Card>

      {/* Grade Scale Reference */}
      <Card variant="bordered" className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Grade Scale Reference
        </h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {Object.entries(GRADE_SCALE).map(([grade, points]) => (
            <div
              key={grade}
              className="flex justify-between py-1 px-2 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <span className="font-medium">{grade}</span>
              <span className="text-gray-500">{points.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎓 What is GPA Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          GPA Calculator helps students compute their Grade Point Average using the standard 4.0 scale used by most American universities.
          Enter your courses, credit hours, and letter grades to instantly calculate your cumulative GPA.
          The calculator shows Latin honors benchmarks (Summa Cum Laude, Magna Cum Laude, Cum Laude) based on your GPA.
          Perfect for tracking academic progress, planning course loads, and preparing for graduate school applications.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 GPA Scale and Latin Honors
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">GPA Range</th>
                <th className="text-left py-2 px-2">Honor</th>
                <th className="text-left py-2 px-2">Meaning</th>
                <th className="text-left py-2 px-2">Percentile</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3.9 - 4.0</td><td>Summa Cum Laude</td><td>With highest honor</td><td>Top 1-5%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3.7 - 3.89</td><td>Magna Cum Laude</td><td>With great honor</td><td>Top 5-10%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3.5 - 3.69</td><td>Cum Laude</td><td>With honor</td><td>Top 10-15%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3.0 - 3.49</td><td>Dean&apos;s List</td><td>Academic excellence</td><td>Top 15-30%</td></tr>
              <tr><td className="py-2 px-2 font-medium">2.0 - 2.99</td><td>Good Standing</td><td>Satisfactory progress</td><td>Average</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 GPA Improvement Strategies
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Credit hour impact</strong>: Higher credit courses affect GPA more significantly</li>
          <li><strong>Grade replacement</strong>: Many schools allow retaking courses to replace low grades</li>
          <li><strong>Strategic course selection</strong>: Balance challenging courses with ones you can excel in</li>
          <li><strong>Office hours</strong>: Professors and TAs can help clarify concepts before exams</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How is GPA calculated?',
            answer: 'GPA is calculated by multiplying each course grade point by its credit hours, summing all quality points, then dividing by total credit hours. For example: (A in 3-credit = 12 points) + (B in 4-credit = 12 points) = 24 points / 7 credits = 3.43 GPA.',
          },
          {
            question: 'What GPA do I need for graduate school?',
            answer: 'Most graduate programs require a minimum 3.0 GPA. Competitive programs often expect 3.5+. However, admissions also consider GRE scores, research experience, and letters of recommendation.',
          },
          {
            question: 'Does an A+ give more than 4.0 points?',
            answer: 'In the standard 4.0 scale used by most US universities, both A and A+ equal 4.0 points. Some schools use a 4.3 scale where A+ = 4.3, but this is less common.',
          },
        ]}
      />
    </div>
  );
}
