const CalendarEventRenderer = (arg: any) => {
  const job = arg.event.extendedProps?.job;
  const isChanged = arg.event.extendedProps?.isChanged;
  

  return (
    <div
      className="fc-event-main flex items-center"
      style={{
        backgroundColor: '#95c941',
        color: 'white',
        borderColor: '#0369a1',
        borderRadius: '4px',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          backgroundColor: isChanged ? '#fb923c' : (job?.isChange ? '#fb923c' : '#0891b2'),
          width: 10,
          height: 10,
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: 8,
        }}
      />
      <span>{arg.event.title}</span>
    </div>
  );
};

export default CalendarEventRenderer;
