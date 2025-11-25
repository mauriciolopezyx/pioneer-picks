import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SpecificProfessorCourse from '@/components/professors/SpecificCourse';
import AllProfessorCourses from '@/components/professors/AllCourses';
import { useParsedLocalSearchParams } from '@/services/utils';

type ProfessorParams = {
    id: string,
    courseId?: string,
    subjectName?: string,
    subjectAbbreviation?: string,
    courseAbbreviation?: string,
    getAll: boolean
}

const Professor = () => {

    const params = useParsedLocalSearchParams<ProfessorParams>((raw) => ({
        id: raw.id!,
        courseId: raw.courseId,
        subjectName: raw.subjectName,
        subjectAbbreviation: raw.subjectAbbreviation,
        courseAbbreviation: raw.courseAbbreviation,
        getAll: raw.getAll === "true",
    }))

    const { id: professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation, getAll } = params
    const navigation = useNavigation()

    useEffect(() => {
        if (subjectName) {
            navigation.setOptions({
                headerBackTitle: (subjectAbbreviation && courseAbbreviation) ? `${subjectAbbreviation} ${courseAbbreviation}` : "Search"
            })
        }
    }, [subjectName])

    if (getAll) {
        return (
            <AllProfessorCourses params={{professorId: professorId}} />
        )
    }

    return (
        <SpecificProfessorCourse params={{professorId: professorId, courseId: courseId!, subjectName: subjectName!, subjectAbbreviation: subjectAbbreviation!, courseAbbreviation: courseAbbreviation!}}/>
    )
}

export default Professor