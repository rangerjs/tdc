package org.test.tdc.service;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.test.tdc.dao.AccessDataProcessor;
import org.test.tdc.pojo.ProjectTO;

@Service
public class TestDataService {
	
	@Resource
	private AccessDataProcessor accessDataProcessor;
	
	public List<ProjectTO> queryProject(){
		List<ProjectTO> projects = new ArrayList<ProjectTO>();
		
		String queryProeject = "select * from project";
		try {
			ResultSet query = accessDataProcessor.query(queryProeject);
			
			
			ProjectTO projectTO = null;
			while(query.next()){
				projectTO = new ProjectTO();
				projectTO.setId(query.getLong("N_ID"));
				projectTO.setName(query.getString("S_NAME"));
				//projectTO.setName(new String(query.getBytes("S_NAME"),"gbk"));
				
				projects.add(projectTO);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return projects;
	}
}