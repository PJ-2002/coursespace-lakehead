//@ts-check

import { doc, getFirestore, Timestamp, updateDoc } from "@firebase/firestore";
import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import Page from "components/Page";
import { useRouter } from "next/router";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import AdapterMoment from "@mui/lab/AdapterMoment"
import moment from "moment"

const TermSection = ({
  title,
  loading,
  registerDate,
  dropDate,
  onRegisterDateChange,
  onDropDateChange
}) =>
  loading
    ? <h2>Loading</h2>
    : <Box>
        <h2>{title}</h2>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box sx={{width: 500 }}>
            <StaticDatePicker
              orientation="landscape"
              label="Registration Deadline"
              openTo="day"
              value={registerDate}
              onChange={(value) => onRegisterDateChange(value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>


          <Box sx={{ width: 500 }}>
            <StaticDatePicker
              orientation="landscape"
              label="Drop Deadline"
              openTo="day"
              value={dropDate}
              onChange={(value) => onDropDateChange(value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
      </Box>

export default function UpdateTermDatesPage() {
  const firestore = getFirestore()

  const router = useRouter()

  const [fallDueDates, fallDueDatesLoading] = useDocumentData(
    doc(firestore, "duedates", "fall")
  )

  const [winterDueDates, winterDueDatesLoading] = useDocumentData(
    doc(firestore, "duedates", "winter")
  )

  const [springDueDates, springDueDatesLoading] = useDocumentData(
    doc(firestore, "duedates", "spring")
  )

  const [summerDueDates, summerDueDatesLoading] = useDocumentData(
    doc(firestore, "duedates", "summer")
  )

  const [yearLongDueDates, yearLongDueDatesLoading] = useDocumentData(
    doc(firestore, "duedates", "year-long")
  )

  const onRegisterDateChange = (/** @type {string} */ term, /** @type {{ toDate: () => Date; }} */ newDate) => {
    updateDoc(
      doc(firestore, "duedates", term), {
        register: Timestamp.fromDate(newDate.toDate())
      }
    )
  }

  const onDropDateChange = (term, newDate) => {
    updateDoc(
      doc(firestore, "duedates", term), {
        drop: Timestamp.fromDate(newDate.toDate())
      }
    )
  }

  return (
    <Page title={"Update Due Dates"} hasBack onBack={router.back}>

      <TermSection
        title={"Fall"}
        loading={fallDueDatesLoading}
        registerDate={moment(fallDueDates?.register.toDate())}
        dropDate={moment(fallDueDates?.drop.toDate())}
        onRegisterDateChange={(value) => onRegisterDateChange("fall", value)}
        onDropDateChange={(value) => onDropDateChange("fall", value)}
      />

      <TermSection
        title={"Winter"}
        loading={winterDueDatesLoading}
        registerDate={moment(winterDueDates?.register.toDate())}
        dropDate={moment(winterDueDates?.drop.toDate())}
        onRegisterDateChange={(value) => onRegisterDateChange("winter", value)}
        onDropDateChange={(value) => onDropDateChange("winter", value)}
      />

      <TermSection
        title={"Spring"}
        loading={springDueDatesLoading}
        registerDate={moment(springDueDates?.register.toDate())}
        dropDate={moment(springDueDates?.drop.toDate())}
        onRegisterDateChange={(value) => onRegisterDateChange("spring", value)}
        onDropDateChange={(value) => onDropDateChange("spring", value)}
      />

      <TermSection
        title={"Summer"}
        loading={summerDueDatesLoading}
        registerDate={moment(summerDueDates?.register.toDate())}
        dropDate={moment(summerDueDates?.drop.toDate())}
        onRegisterDateChange={(value) => onRegisterDateChange("summer", value)}
        onDropDateChange={(value) => onDropDateChange("summer", value)}
      />

      <TermSection
        title={"Year Long"}
        loading={yearLongDueDatesLoading}
        registerDate={moment(yearLongDueDates?.register.toDate())}
        dropDate={moment(yearLongDueDates?.drop.toDate())}
        onRegisterDateChange={(value) => onRegisterDateChange("year-long", value)}
        onDropDateChange={(value) => onDropDateChange("year-long", value)}
      />
    </Page>
  )
}