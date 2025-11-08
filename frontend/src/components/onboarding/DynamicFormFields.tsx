
import { ProfileField } from '@/src/types';
import { AlertCircle } from 'lucide-react';

interface DynamicFieldProps {
  field: ProfileField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const baseClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
  }`;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            pattern={field.validation?.pattern}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {field.description && (
        <p className="text-xs text-gray-500 mt-1">{field.description}</p>
      )}
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

interface DynamicFieldGroupProps {
  fields: ProfileField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  errors: Record<string, string>;
}

export const DynamicFieldGroup: React.FC<DynamicFieldGroupProps> = ({
  fields,
  values,
  onChange,
  errors
}) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <DynamicField
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={(value) => onChange(field.name, value)}
          error={errors[field.name]}
        />
      ))}
    </div>
  );
};

// Technology/Skill selector component
interface TechnologySelectorProps {
  label: string;
  description?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
}

export const TechnologySelector: React.FC<TechnologySelectorProps> = ({
  label,
  description,
  options,
  selected,
  onChange,
  maxSelections
}) => {
  const toggleTechnology = (tech: string) => {
    if (selected.includes(tech)) {
      onChange(selected.filter(t => t !== tech));
    } else {
      if (maxSelections && selected.length >= maxSelections) {
        return; // Don't add if max reached
      }
      onChange([...selected, tech]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => toggleTechnology(tech)}
            // disabled={maxSelections && selected.length >= maxSelections && !selected.includes(tech)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected.includes(tech)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
      {maxSelections && (
        <p className="text-xs text-gray-500 mt-2">
          {selected.length} / {maxSelections} selected
        </p>
      )}
    </div>
  );
};
