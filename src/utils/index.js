export const getRepairedDataTable = (data = []) => {
  return data.map((ele, index) => {
    ele.STT = index + 1;
    ele.Action = (
      <div className="action">
        <span
          // onClick={() => handleClickInfo(ele, index)}
          style={{ cursor: "pointer" }}
        >
          <img
            className="icon icon-hover"
            src={"/images/info.svg"}
            alt="icon-1"
          />
        </span>
        <span style={{ cursor: "pointer" }}>
          <img
            className="icon icon-hover"
            src={"/images/edit.svg"}
            alt="icon-2"
          />
        </span>
      </div>
    );
    return ele;
  });
};
