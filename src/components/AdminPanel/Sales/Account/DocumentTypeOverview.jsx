import React, { useContext, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "./View/View";
import {
  useGetAllDocumentTypeQuery,
  useEditDocumentTypeMutation,
} from "../../../Store/API/Sales/DocumentTypeApi";
import { ApiContextData } from "../../APIContext/APIContext";
import { Link } from "react-router-dom";

const DocumentTypeOverview = () => {
  const {
    data: allDocumentType,
    error: allDocumentTypeError,
    isLoading,
  } = useGetAllDocumentTypeQuery();
  const [editDocument, { isLoading: isEditing, error: editError }] =
    useEditDocumentTypeMutation();
  const { userID } = useContext(ApiContextData);

  const HandleSave = async (row, setEditFlag) => {
    // let id = row._id
    const payload = {
      id: row._id,
      updated_by: userID,
      document_name: row.document_name,
      description: row.description,
    };
    try {
      await editDocument(payload).unwrap();
      setEditFlag(false);
    } catch (error) {
      console.log(error);
    }
  };
  const ViewDocumentTypeColumns = [
    {
      key: "sno",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "document_name",
      name: "Document Name",
      editable: true,
      customEditElement: (row, index, setEditFlag, handelchange, column) => (
        <input
          type="text"
          className="form-control"
          onChange={(e) => handelchange(e, index, column)}
          placeholder={row.document_name}
        />
      ),
    },
    {
      key: "description",
      name: "Description",
      editable: true,
    },
    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row, index, setEditFlag) => {
        return (
          <div className="flex-row">
            <button
              className="icon-1"
              title="Edit"
              onClick={() => {
                setEditFlag(index);
              }}
            >
              <i className="bi bi-pencil" />
            </button>

            <button
              className="icon-1"
              title="Cancel Edit"
              onClick={() => {
                setEditFlag(false);
              }}
            >
              <i className="bi bi-x-square-fill" />
            </button>

            <button
              className="icon-1"
              title="Save"
              onClick={() => {
                HandleSave(row, setEditFlag);
              }}
            >
              <i className="bi bi-save" />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Document Type"} link={true} />
        </div>
        <div className="action_btns">
          <Link to={"/admin/sales-document-type-master"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add Document Type
            </button>
          </Link>
        </div>
      </div>
      <View
        columns={ViewDocumentTypeColumns}
        data={allDocumentType}
        // rowSelectable={true}
        pagination
        isLoading={isLoading}
        title={"Document Type overview"}
      />
    </div>
  );
};

export default DocumentTypeOverview;
