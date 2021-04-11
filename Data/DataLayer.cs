using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace HealthCheck.Data
{
    public class DataLayer
    {
        private string connString="";
        
        public DataLayer()
        {
            connString=AppData.configuration.GetConnectionString("DiaryConnection");
        }
        

        public bool ExecuteSQL(string SQLstring)
        {
            SqlConnection sqlCon = null; SqlCommand sqlCmd = null;
            bool retVal = false;
            try
            {
                //Setup command object  
                sqlCmd = new SqlCommand(SQLstring);
                sqlCmd.CommandType = CommandType.Text;
                sqlCmd.CommandTimeout = 100000;
                sqlCon = new SqlConnection(connString);
                sqlCmd.Connection = sqlCon;
                sqlCon.Open();
                //Execute the command  
                int iR = sqlCmd.ExecuteNonQuery();
                retVal = iR > 0 ? true : false;
            }
            catch { retVal = false; throw; }
            finally
            {
                if (sqlCmd != null) sqlCmd.Dispose();
                if (sqlCon.State == ConnectionState.Open) sqlCon.Close();
            }
            return retVal;
        }

        public DataTable ExecuteQuery(string SQLstring)
        {

            SqlConnection sqlCon = null; SqlCommand sqlCmd = new SqlCommand();
            SqlDataAdapter da = new SqlDataAdapter(); DataTable dt = new DataTable();
            try
            {
                //Setup command object  
                sqlCmd = new SqlCommand(SQLstring);
                sqlCmd.CommandType = CommandType.Text;
                sqlCmd.CommandTimeout = 10000000;
                da.SelectCommand = (SqlCommand)sqlCmd;
                sqlCon = new SqlConnection(connString);
                sqlCmd.Connection = sqlCon;
                sqlCon.Open();
                //Fill the dataset  
                da.Fill(dt);
            }
            catch { throw; }
            finally
            {
                if (da != null) da.Dispose();
                if (sqlCmd != null) sqlCmd.Dispose();
                if (sqlCon.State == ConnectionState.Open) sqlCon.Close();
            }
            return dt;
        }

       
    }
}