import React from 'react';

interface SliderComponentProps {
  sliderInfo: {
    name: string;
    min: number;
    max: number;
    step: number;
    default: number;
  };
  value: number;
  onChange: (value: number) => void;
}

function SliderComponent({ sliderInfo, value, onChange }: SliderComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div aria-haspopup="true" aria-expanded="false">
      <div className="slider css-160w4cx">
        <div className="css-1povu0j" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="body-small css-bjbdno">{sliderInfo.name}</span>
          <input
            className="text-input text-sm text-right"
            style={{ maxWidth: '4em', padding: '0.2em' }}
            type="number"
            min={sliderInfo.min}
            max={sliderInfo.max}
            step={sliderInfo.step}
            value={value}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            id="small-range"
            type="range"
            min={sliderInfo.min}
            max={sliderInfo.max}
            step={sliderInfo.step}
            value={value}
            className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default SliderComponent;