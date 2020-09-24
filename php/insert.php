<!-- Include Database connections info.      -->
<?php include "auth.php"?>
<!-- Verify if user exists for login -->
<?php
$insertSite_sql = "insert into appointments(title) values('hello3');";
$result= mysqli_query($conn,$insertSite_sql) or die("Ошибка " . mysqli_error($conn)); 
if($result)
{
    echo "Выполнение запроса прошло успешно";
}
// закрываем подключение
mysqli_close($conn);
?>
