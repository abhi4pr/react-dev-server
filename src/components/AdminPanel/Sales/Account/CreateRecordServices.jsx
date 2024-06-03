import CustomSelect from "../../../ReusableComponents/CustomSelect";
import FieldContainer from "../../FieldContainer";

const RecordServices = ({ records, setRecords, serviceTypes }) => {
  const handleRecordChange = (index, key, value) => {
    const updatedRecords = records?.map((record, recordIndex) =>
      recordIndex === index ? { ...record, [key]: value } : record
    );
    setRecords(updatedRecords);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = [...records];
    updatedRecords.splice(index, 1);
    setRecords(updatedRecords);
  };

  const getAvailableServiceTypes = (currentIndex) => {
    const selectedTypes = records.map((record) => record.type).filter(Boolean);
    return serviceTypes.filter(
      (type) =>
        !selectedTypes.includes(type._id) ||
        records[currentIndex].type === type._id
    );
  };
  return (
    <>
      {records?.map((record, index) => (
        <div className="card" key={index}>
          <div className="card-header">
            <h4>Record ({index + 1})</h4>
            <button
              className="btn cmnbtn btn-danger"
              onClick={() => handleDeleteRecord(index)}
            >
              Delete
            </button>
          </div>
          <div className="card-body">
            <div className="row record-container">
              <CustomSelect
                label="Service Type"
                fieldGrid={6}
                dataArray={getAvailableServiceTypes(index)}
                optionId="_id"
                optionLabel="service_name"
                selectedId={record.type}
                setSelectedId={(value) =>
                  handleRecordChange(index, "type", value)
                }
                required
              />

              <FieldContainer
                label="Sale Booking ID"
                type="number"
                fieldGrid={6}
                value={record.sale_booking_id || ""}
                onChange={(e) =>
                  handleRecordChange(index, "sale_booking_id", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Sales Service Master ID"
                type="text"
                fieldGrid={6}
                value={record.sales_service_master_id || ""}
                onChange={(e) =>
                  handleRecordChange(
                    index,
                    "sales_service_master_id",
                    e.target.value
                  )
                }
                required
              />

              <FieldContainer
                label="Amount"
                type="number"
                fieldGrid={6}
                value={record.amount || ""}
                onChange={(e) =>
                  handleRecordChange(index, "amount", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Number of Hours"
                type="number"
                fieldGrid={6}
                value={record.no_of_hours || ""}
                onChange={(e) =>
                  handleRecordChange(index, "no_of_hours", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Goal"
                type="text"
                fieldGrid={6}
                value={record.goal || ""}
                onChange={(e) =>
                  handleRecordChange(index, "goal", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Day"
                type="number"
                fieldGrid={6}
                value={record.day || ""}
                onChange={(e) =>
                  handleRecordChange(index, "day", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Quantity"
                type="number"
                fieldGrid={6}
                value={record.quantity || ""}
                onChange={(e) =>
                  handleRecordChange(index, "quantity", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Brand Name"
                type="text"
                fieldGrid={6}
                value={record.brand_name || ""}
                onChange={(e) =>
                  handleRecordChange(index, "brand_name", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Hashtag"
                type="text"
                fieldGrid={6}
                value={record.hashtag || ""}
                onChange={(e) =>
                  handleRecordChange(index, "hashtag", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Individual Amount"
                type="number"
                fieldGrid={6}
                value={record.individual_amount || ""}
                onChange={(e) =>
                  handleRecordChange(index, "individual_amount", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Start Date"
                type="date"
                fieldGrid={6}
                value={record.start_date ? record.start_date.split("T")[0] : ""}
                onChange={(e) =>
                  handleRecordChange(index, "start_date", e.target.value)
                }
                required
              />

              <FieldContainer
                label="End Date"
                type="date"
                fieldGrid={6}
                value={record.end_date ? record.end_date.split("T")[0] : ""}
                onChange={(e) =>
                  handleRecordChange(index, "end_date", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Per Month Amount"
                type="number"
                fieldGrid={6}
                value={record.per_month_amount || ""}
                onChange={(e) =>
                  handleRecordChange(index, "per_month_amount", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Number of Creators"
                type="number"
                fieldGrid={6}
                value={record.no_of_creators || ""}
                onChange={(e) =>
                  handleRecordChange(index, "no_of_creators", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Deliverables Info"
                type="text"
                fieldGrid={6}
                value={record.deliverables_info || ""}
                onChange={(e) =>
                  handleRecordChange(index, "deliverables_info", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Remarks"
                type="text"
                fieldGrid={6}
                value={record.remarks || ""}
                onChange={(e) =>
                  handleRecordChange(index, "remarks", e.target.value)
                }
                required
              />

              <FieldContainer
                label="Excel Upload"
                type="file"
                fieldGrid={6}
                onChange={(e) =>
                  handleRecordChange(index, "excel_upload", e.target.files[0])
                }
                required
              />

              {record.excel_upload_url && (
                <div className="col-6">
                  <label>Uploaded File</label>
                  <a
                    href={record.excel_upload_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RecordServices;
