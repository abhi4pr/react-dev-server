const FieldContainer = ({
  label,
  Tag = "input",
  type = "text",
  step = "any",
  rows,
  cols,
  value,
  onChange,
  onBlur,
  onKeyUp,
  required = true,
  disabled = false,
  children,
  fieldGrid = 6,
  multiple,
  placeholder,
  accept,
  max,
  maxLength,
  name,
  min,
  astric = false,
}) => {
  return (
    <div
      className={
        Tag == "textarea"
          ? "col-xl-12 col-lg-12 col-md-12 col-sm-12"
          : `col-xl-${fieldGrid} col-lg-${fieldGrid} col-md-${fieldGrid} col-sm-12`
      }
    >
      <div className="form-group">
        <label className="form-label">
          {label} {astric === true && <sup style={{ color: "red" }}>*</sup>}
        </label>
        <Tag
          step={step}
          className={Tag == "select" ? "form-select" : "form-control"}
          type={type}
          value={value}
          rows={rows}
          cols={cols}
          onKeyUp={onKeyUp}
          onChange={onChange}
          required={required}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          placeholder={placeholder}
          max={max}
          maxLength={maxLength}
          name={name}
          min={min}
          onBlur={onBlur}
        >
          {children}
        </Tag>
      </div>
    </div>
  );
};

export default FieldContainer;
