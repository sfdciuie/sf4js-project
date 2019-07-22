public with sharing class SessionController {

    /**
    * Retrieve all sessions
    * In a prod environment, the operation should be paginated dynamically
    * and the filtering should be done here rather than on the client side
    */
    @AuraEnabled(cacheable=true)
    public static List<Session__c> getSessions() {
        return [SELECT Id, Name, Date_and_Time__c FROM Session__c LIMIT 100];
    }

    /**
    * Retrieve a session with its speakers or null if session is not found.
    * @param sessionId
    */
    @AuraEnabled(cacheable=true)
    public static Session__c getSessionWithSpeakers(Id sessionId) {
        List<Session__c> sessions = [SELECT Id, Name, Room__c, Description__c, Date_and_Time__c, 
                (SELECT Speaker__r.Id, Speaker__r.First_Name__c, Speaker__r.Last_Name__c, Speaker__r.Bio__c, Speaker__r.Email__c FROM Session_Speakers__r) 
                FROM Session__c WHERE Id = :sessionId];
        if (sessions.size() == 0) {
            return null;
        }
        return sessions.get(0);
    }
}